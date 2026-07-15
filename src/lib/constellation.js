// Constellation query helpers.
//
// `fetchAllLinks`/`getCollectionTotal` are ported from
// `legacy/components/ArticleMentions/api.js` (same public counts endpoint
// used to build the mentions UI). `countReactions` reuses that same pattern
// to read aggregate reaction counts for an article's at:// URI.
//
// Endpoint/shape notes (mirrors the legacy mentions implementation):
//   - `GET {CONSTELLATION_BASE}/links/all?target=<url>` returns
//     `{ links: { [collection]: { [sourcePath]: { records: N } } } }` -- a
//     *counts-only* index, grouped by collection and by which field on the
//     linking record points at the target (e.g. `.subject.uri`). This is what
//     `fetchAllLinks`/`getCollectionTotal` read.
//   - `GET {CONSTELLATION_BASE}/xrpc/blue.microcosm.links.getBacklinks` (given
//     `subject`, `source` = `${collection}:${path}`, `limit`, `cursor`)
//     returns the actual linking record *pointers*:
//     `{ records: [{ did, collection, rkey }], cursor }`. It does NOT include
//     the record's `value`, only enough to locate it.
//   - Because a reaction's `type` lives in the record `value` (not in the
//     backlink pointer), each backlink is resolved to its full record via
//     `com.atproto.repo.getRecord` (tried first against the public Bluesky
//     AppView, then against the repo's own PDS, resolved via
//     `plc.directory`/`did:web` -- the same fallback chain
//     `resolveGenericRecords` uses in `ArticleMentions/api.js`) before the
//     resulting `{ value: { type } }` records are tallied with
//     `aggregateReactionCounts`.
//
// This mirrors the legacy implementation's patterns but has NOT been
// live-verified against production Constellation specifically for the
// `codes.trezy.reaction` collection (network calls are intentionally
// excluded from this task's test suite, which covers only the pure
// `aggregateReactionCounts`/`getCollectionTotal` logic). Treat the exact
// backlink-pointer shape and the AppView/PDS record-resolution fallback as a
// manual-verify item.
//
// `fetchCollectionBacklinks` and `fetchRecord` (renamed from legacy's
// `fetchReactionRecord` -- despite the old name, it's a generic
// `com.atproto.repo.getRecord` fetch with an AppView-then-PDS fallback, not
// reaction-specific) are also exported here, purely for reuse: Task 24's
// `<article-mentions>` island (`src/components/islands/article-mentions.js`)
// needs the exact same collection-scoped backlink fetch + record-resolution
// fallback chain `countReactions` already uses above, just applied to six
// different collections instead of `codes.trezy.reaction`. Consolidating
// here avoids a second copy of this logic (which is what
// `legacy/components/ArticleMentions/api.js` and this file's `countReactions`
// used to each carry independently).

import { aggregateReactionCounts, REACTION_TYPES } from './atproto-reactions.js'

const CONSTELLATION_BASE = import.meta.env.PUBLIC_CONSTELLATION_URL || 'https://constellation.microcosm.blue'
const BSKY_PUBLIC_API = import.meta.env.PUBLIC_BSKY_PUBLIC_API || 'https://public.api.bsky.app'

const REACTION_COLLECTION = 'codes.trezy.reaction'

export { REACTION_TYPES }

// Exported so other atproto-backed islands (e.g. `article-mentions.js`, Task
// 24) that talk to the public Bluesky AppView directly (`app.bsky.actor.
// getProfiles`, `app.bsky.feed.getPosts`, etc. -- endpoints this module
// doesn't itself wrap) can reuse the same base URL/env override instead of
// hardcoding it a second time.
export { BSKY_PUBLIC_API }

export async function fetchAllLinks(targetURL) {
	const res = await fetch(
		`${CONSTELLATION_BASE}/links/all?target=${encodeURIComponent(targetURL)}`,
		{ headers: { 'Accept': 'application/json' } },
	)

	if (!res.ok) return {}

	const data = await res.json()
	return data.links || {}
}

export function getCollectionTotal(links, collection) {
	const sources = links[collection]
	if (!sources) return 0
	return Object.values(sources).reduce((sum, info) => sum + info.records, 0)
}

async function fetchBacklinksForSource(targetURL, source, limit = 100) {
	const records = []
	let cursor = null

	do {
		const params = new URLSearchParams({
			subject: targetURL,
			source,
			limit: String(limit),
		})

		if (cursor) {
			params.set('cursor', cursor)
		}

		const res = await fetch(
			`${CONSTELLATION_BASE}/xrpc/blue.microcosm.links.getBacklinks?${params}`,
			{ headers: { 'Accept': 'application/json' } },
		)

		if (!res.ok) break

		const data = await res.json()
		records.push(...(data.records || []))
		cursor = data.cursor

		if (records.length >= limit) break
	} while (cursor)

	return records.slice(0, limit)
}

// Exported for reuse by `src/components/islands/article-mentions.js` (Task
// 24), which needs the same collection-scoped backlink-pointer fetch this
// module already does for `countReactions` -- rather than maintaining a
// second copy (as `legacy/components/ArticleMentions/api.js` did).
export async function fetchCollectionBacklinks(targetURL, links, collection, limit = 100) {
	const sources = links[collection]
	if (!sources) return []

	const fetches = []

	for (const [path, info] of Object.entries(sources)) {
		if (!info.records) continue

		const cleanPath = path.startsWith('.') ? path.slice(1) : path
		const source = `${collection}:${cleanPath}`
		fetches.push(fetchBacklinksForSource(targetURL, source, limit))
	}

	const results = await Promise.all(fetches)
	const allRecords = results.flat()

	const seen = new Set()
	return allRecords.filter(r => {
		const uri = `at://${r.did}/${r.collection}/${r.rkey}`
		if (seen.has(uri)) return false
		seen.add(uri)
		return true
	}).slice(0, limit)
}

const pdsCache = new Map()

async function resolvePDS(did) {
	if (pdsCache.has(did)) return pdsCache.get(did)

	let pds = null

	try {
		if (did.startsWith('did:plc:')) {
			const res = await fetch(`https://plc.directory/${did}`)
			if (res.ok) {
				const doc = await res.json()
				const service = doc.service?.find(s => s.id === '#atproto_pds')
				pds = service?.serviceEndpoint || null
			}
		} else if (did.startsWith('did:web:')) {
			const domain = did.replace('did:web:', '').replace(/:/g, '/')
			const res = await fetch(`https://${domain}/.well-known/did.json`)
			if (res.ok) {
				const doc = await res.json()
				const service = doc.service?.find(s => s.id === '#atproto_pds')
				pds = service?.serviceEndpoint || null
			}
		}
	} catch {
		// skip
	}

	pdsCache.set(did, pds)
	return pds
}

// Resolves a single `at://<did>/<collection>/<rkey>` record's full value:
// tries the public Bluesky AppView first, then falls back to the repo's own
// PDS (resolved/cached via `resolvePDS`). Returns `null` if both fail.
//
// Despite the name (kept from legacy's `fetchReactionRecord`, which this was
// ported from verbatim), there's nothing reaction-specific here -- it's a
// generic atproto record fetch. Exported for reuse by
// `src/components/islands/article-mentions.js` (Task 24), which resolves
// backlink pointers for six *different* collections (Bluesky posts, standard
// docs, Semble cards/connections, Margin highlights/notes) the same way
// legacy's `resolveGenericRecords`/`resolveBskyPosts` did, rather than
// duplicating this AppView-then-PDS fallback chain a second time.
export async function fetchRecord(did, collection, rkey) {
	const params = new URLSearchParams({ repo: did, collection, rkey })

	// Try the public Bluesky AppView first.
	try {
		const res = await fetch(`${BSKY_PUBLIC_API}/xrpc/com.atproto.repo.getRecord?${params}`)
		if (res.ok) return await res.json()
	} catch {
		// skip
	}

	// Fall back to the repo's own PDS.
	const pds = await resolvePDS(did)

	if (pds) {
		try {
			const res = await fetch(`${pds}/xrpc/com.atproto.repo.getRecord?${params}`)
			if (res.ok) return await res.json()
		} catch {
			// skip
		}
	}

	return null
}

// Queries Constellation for `codes.trezy.reaction` records whose `subject`
// targets `atUri`, resolves each backlink to its record, and returns
// per-type counts, e.g. `{ heart: 3, fire: 1 }`. Resilient to any failure
// along the way: returns `{}` rather than throwing.
export async function countReactions(atUri) {
	try {
		const links = await fetchAllLinks(atUri)
		const total = getCollectionTotal(links, REACTION_COLLECTION)

		if (total === 0) return {}

		const backlinks = await fetchCollectionBacklinks(atUri, links, REACTION_COLLECTION, total)

		const resolved = await Promise.all(
			backlinks.map(backlink => fetchRecord(backlink.did, backlink.collection, backlink.rkey)),
		)

		return aggregateReactionCounts(resolved.filter(Boolean))
	} catch {
		return {}
	}
}
