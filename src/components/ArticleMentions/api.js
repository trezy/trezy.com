const CONSTELLATION_BASE = process.env.NEXT_PUBLIC_CONSTELLATION_URL || 'https://constellation.microcosm.blue'
const BSKY_PUBLIC_API = process.env.NEXT_PUBLIC_BSKY_PUBLIC_API || 'https://public.api.bsky.app'

export const SUPPORTED_COLLECTIONS = [
	'app.bsky.feed.post',
	'site.standard.document',
	'network.cosmik.card',
	'network.cosmik.connection',
	'at.margin.highlight',
	'at.margin.note',
]

export const COLLECTION_GROUPS = [
	{
		id: 'bluesky',
		name: 'Bluesky',
		collections: ['app.bsky.feed.post'],
	},
	{
		id: 'articles',
		name: 'Articles',
		collections: ['site.standard.document'],
	},
	{
		id: 'semble',
		name: 'Semble',
		collections: ['network.cosmik.card', 'network.cosmik.connection'],
	},
	{
		id: 'margin',
		name: 'Margin',
		collections: ['at.margin.highlight', 'at.margin.note'],
	},
]

export const COLLECTION_META = {
	'app.bsky.feed.post': { group: 'bluesky' },
	'site.standard.document': { group: 'articles' },
	'network.cosmik.card': { group: 'semble' },
	'network.cosmik.connection': { group: 'semble' },
	'at.margin.highlight': { group: 'margin' },
	'at.margin.note': { group: 'margin' },
}

export function getHighlightId(text) {
	if (!text) return null
	let hash = 0

	for (let i = 0; i < text.length; i++) {
		hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
	}

	return `hl-${(hash >>> 0).toString(36)}`
}

export async function fetchAllLinks(articleURL) {
	const res = await fetch(
		`${CONSTELLATION_BASE}/links/all?target=${encodeURIComponent(articleURL)}`,
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

export async function fetchCollectionBacklinks(articleURL, links, collection, limit = 100) {
	const sources = links[collection]
	if (!sources) return []

	const fetches = []

	for (const [path, info] of Object.entries(sources)) {
		if (!info.records) continue

		const cleanPath = path.startsWith('.') ? path.slice(1) : path
		const source = `${collection}:${cleanPath}`
		fetches.push(fetchBacklinksForSource(articleURL, source, limit))
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

async function resolveProfiles(dids) {
	const profiles = new Map()

	for (let i = 0; i < dids.length; i += 25) {
		const chunk = dids.slice(i, i + 25)
		const params = chunk.map(did => `actors=${encodeURIComponent(did)}`).join('&')

		try {
			const res = await fetch(`${BSKY_PUBLIC_API}/xrpc/app.bsky.actor.getProfiles?${params}`)
			if (res.ok) {
				const data = await res.json()
				for (const profile of (data.profiles || [])) {
					profiles.set(profile.did, profile)
				}
			}
		} catch {
			// skip
		}
	}

	return profiles
}

async function resolveGenericRecords(backlinks) {
	if (backlinks.length === 0) return []

	const uniqueDIDs = [...new Set(backlinks.map(r => r.did))]
	await Promise.all(uniqueDIDs.map(did => resolvePDS(did)))

	const results = await Promise.all(
		backlinks.map(async (r) => {
			const params = new URLSearchParams({
				repo: r.did,
				collection: r.collection,
				rkey: r.rkey,
			})

			// Try Bluesky AppView first
			try {
				const res = await fetch(`${BSKY_PUBLIC_API}/xrpc/com.atproto.repo.getRecord?${params}`)
				if (res.ok) return { ...(await res.json()), did: r.did }
			} catch {
				// skip
			}

			// Fall back to the user's PDS
			const pds = pdsCache.get(r.did)

			if (pds) {
				try {
					const res = await fetch(`${pds}/xrpc/com.atproto.repo.getRecord?${params}`)
					if (res.ok) return { ...(await res.json()), did: r.did }
				} catch {
					// skip
				}
			}

			return {
				uri: `at://${r.did}/${r.collection}/${r.rkey}`,
				did: r.did,
				value: null,
			}
		}),
	)

	const dids = [...new Set(results.map(r => r.did))]
	const profiles = await resolveProfiles(dids)

	return results.map(record => ({
		...record,
		author: profiles.get(record.did) || null,
	}))
}

async function resolveBskyPosts(backlinks) {
	if (backlinks.length === 0) return []

	const uris = backlinks.map(r => `at://${r.did}/${r.collection}/${r.rkey}`)
	const posts = []

	for (let i = 0; i < uris.length; i += 25) {
		const chunk = uris.slice(i, i + 25)
		const params = chunk.map(uri => `uris=${encodeURIComponent(uri)}`).join('&')

		try {
			const res = await fetch(`${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.getPosts?${params}`)
			if (res.ok) {
				const data = await res.json()
				posts.push(...(data.posts || []))
			}
		} catch {
			// skip
		}
	}

	return posts.map(post => ({
		collection: 'app.bsky.feed.post',
		uri: post.uri,
		author: post.author,
		text: post.record.text,
		createdAt: post.record.createdAt,
	}))
}

async function resolveStandardDocs(backlinks) {
	const records = await resolveGenericRecords(backlinks)
	if (records.length === 0) return []

	const pubURIs = [...new Set(records.map(r => r.value?.site).filter(Boolean))]
	const publications = new Map()

	await Promise.all(pubURIs.map(async (uri) => {
		try {
			const parts = uri.replace('at://', '').split('/')
			const [repo, col, rkey] = parts
			const params = new URLSearchParams({ repo, collection: col, rkey })
			const res = await fetch(`${BSKY_PUBLIC_API}/xrpc/com.atproto.repo.getRecord?${params}`)
			if (res.ok) {
				const data = await res.json()
				publications.set(uri, { url: data.value?.url, name: data.value?.name })
			}
		} catch {
			// skip
		}
	}))

	return records.map(record => {
		const pub = record.value?.site ? publications.get(record.value.site) : null

		return {
			collection: 'site.standard.document',
			uri: record.uri,
			author: record.author,
			title: record.value?.title,
			path: record.value?.path,
			description: record.value?.description,
			publishedAt: record.value?.publishedAt,
			siteURL: pub?.url || null,
			siteName: pub?.name || null,
		}
	})
}

async function resolveSembleCards(backlinks) {
	const records = await resolveGenericRecords(backlinks)

	return records.map(record => ({
		collection: 'network.cosmik.card',
		uri: record.uri,
		author: record.author,
		type: record.value?.type,
		url: record.value?.url || record.value?.content?.url,
		title: record.value?.content?.metadata?.title,
		description: record.value?.content?.metadata?.description,
		siteName: record.value?.content?.metadata?.siteName,
		text: record.value?.content?.text,
		createdAt: record.value?.createdAt,
	}))
}

async function resolveSembleConnections(backlinks) {
	const records = await resolveGenericRecords(backlinks)

	return records.map(record => ({
		collection: 'network.cosmik.connection',
		uri: record.uri,
		author: record.author,
		source: record.value?.source,
		target: record.value?.target,
		connectionType: record.value?.connectionType,
		note: record.value?.note,
		createdAt: record.value?.createdAt,
	}))
}

async function resolveMarginHighlights(backlinks) {
	const records = await resolveGenericRecords(backlinks)

	return records.map(record => {
		const selector = record.value?.target?.selector
		let highlightText = null

		if (selector?.exact) {
			highlightText = selector.exact
		}

		return {
			collection: record.value?.$type || 'at.margin.highlight',
			uri: record.uri,
			author: record.author,
			highlightText,
			annotation: record.value?.body?.value || null,
			color: record.value?.color,
			tags: record.value?.tags,
			pageTitle: record.value?.target?.title,
			createdAt: record.value?.createdAt,
		}
	})
}

export async function resolveRecords(collection, backlinks) {
	switch (collection) {
		case 'app.bsky.feed.post':
			return resolveBskyPosts(backlinks)
		case 'site.standard.document':
			return resolveStandardDocs(backlinks)
		case 'network.cosmik.card':
			return resolveSembleCards(backlinks)
		case 'network.cosmik.connection':
			return resolveSembleConnections(backlinks)
		case 'at.margin.highlight':
		case 'at.margin.note':
			return resolveMarginHighlights(backlinks)
		default:
			return []
	}
}

export async function fetchCollectionPreviews(articleURL, previewLimit = 5) {
	const links = await fetchAllLinks(articleURL)

	const activeCollections = SUPPORTED_COLLECTIONS.filter(collection => {
		if (!links[collection]) return false
		return getCollectionTotal(links, collection) > 0
	})

	const collectionResults = await Promise.all(
		activeCollections.map(async (collection) => {
			const total = getCollectionTotal(links, collection)
			const backlinks = await fetchCollectionBacklinks(articleURL, links, collection, previewLimit)
			const items = await resolveRecords(collection, backlinks)

			return { collection, total, items }
		}),
	)

	const groups = COLLECTION_GROUPS
		.map(group => {
			const matching = collectionResults.filter(r =>
				group.collections.includes(r.collection) && r.items.length > 0,
			)

			if (matching.length === 0) return null

			const allItems = matching.flatMap(r => r.items)

			allItems.sort((a, b) => {
				const dateA = a.createdAt || a.publishedAt || ''
				const dateB = b.createdAt || b.publishedAt || ''

				return dateB.localeCompare(dateA)
			})

			return {
				id: group.id,
				name: group.name,
				collections: group.collections,
				total: matching.reduce((sum, r) => sum + r.total, 0),
				items: allItems.slice(0, previewLimit),
			}
		})
		.filter(Boolean)

	return { groups, links }
}
