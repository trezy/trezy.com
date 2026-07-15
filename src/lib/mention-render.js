// Shared "resolve backlink pointers into typed records" + "typed record into
// a DOM mention card" pipeline, extracted out of
// `../components/islands/article-mentions.js` (Task 24) so Task 24b's
// `<article-mentions-detail>` island (`../components/islands/
// article-mentions-detail.js`) can reuse the exact same logic instead of
// duplicating it a second time. Both islands import `resolveRecords` (to turn
// Constellation backlink pointers into typed mention records) and
// `buildMentionCard` (to turn a typed record into a `<li class="mention-card">`)
// from here.
//
// Ported (transitively, via `article-mentions.js`) from legacy
// `components/ArticleMentions/api.js` (record resolution: `resolveRecords`
// and its per-collection helpers) and `components/ArticleMentions/
// MentionCard.js` (DOM rendering: `buildMentionCard` and its per-collection
// helpers).
import { fetchRecord, BSKY_PUBLIC_API } from './constellation.js'
import { getHighlightId } from './mentions.js'

// ---------------------------------------------------------------------------
// Record resolution
// ---------------------------------------------------------------------------

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

/** Resolves each backlink pointer to its full record (via `fetchRecord`, from `./constellation.js`) plus the author's Bluesky profile. Falls back to a value-less stub for records that fail to resolve, mirroring legacy. */
async function resolveGenericRecords(backlinks) {
	if (backlinks.length === 0) return []

	const results = await Promise.all(
		backlinks.map(async (r) => {
			const record = await fetchRecord(r.did, r.collection, r.rkey)
			if (record) return { ...record, did: r.did }
			return { uri: `at://${r.did}/${r.collection}/${r.rkey}`, did: r.did, value: null }
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
			const [repo, collection, rkey] = uri.replace('at://', '').split('/')
			const record = await fetchRecord(repo, collection, rkey)
			if (record) publications.set(uri, { url: record.value?.url, name: record.value?.name })
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
		const highlightText = selector?.exact || null

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

/** Turns a list of Constellation backlink pointers (`{ did, collection, rkey }`) for one atproto `collection` into the shape `buildMentionCard` understands. Used by both `<article-mentions>` (preview) and `<article-mentions-detail>` (full list). */
export function resolveRecords(collection, backlinks) {
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

// ---------------------------------------------------------------------------
// DOM rendering (ported from legacy `MentionCard.js`)
// ---------------------------------------------------------------------------

function buildTimeElement(value) {
	const date = new Date(value)
	const time = document.createElement('time')
	time.dateTime = date.toISOString()
	time.title = date.toUTCString()
	time.textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
	return time
}

function buildAuthorInfo(author, timestamp) {
	const span = document.createElement('span')
	span.className = 'mention-meta'

	if (author?.avatar) {
		const img = document.createElement('img')
		img.className = 'mention-avatar'
		img.alt = ''
		img.src = author.avatar
		span.append(img)
	}

	if (author) {
		const name = document.createElement('strong')
		name.className = 'mention-display-name'
		name.textContent = author.displayName || author.handle
		span.append(name)

		const handle = document.createElement('span')
		handle.className = 'mention-handle'
		handle.textContent = `@${author.handle}`
		span.append(handle)
	}

	if (timestamp) span.append(buildTimeElement(timestamp))

	return span
}

function buildExternalLink(href, className) {
	const a = document.createElement('a')
	a.className = className
	a.href = href
	a.target = '_blank'
	a.rel = 'noopener noreferrer'
	return a
}

function buildBskyPostMention(item) {
	const li = document.createElement('li')
	li.className = 'mention-card'

	const rkey = item.uri.split('/').pop()
	const postURL = `https://bsky.app/profile/${item.author.handle}/post/${rkey}`

	const link = buildExternalLink(postURL, 'mention-card-link')
	link.append(buildAuthorInfo(item.author, item.createdAt))

	const p = document.createElement('p')
	p.className = 'mention-text'
	p.textContent = item.text
	link.append(p)

	li.append(link)
	return li
}

function buildStandardDocMention(item) {
	const li = document.createElement('li')
	li.className = 'mention-card'

	const url = (item.siteURL && item.path)
		? `${item.siteURL.replace(/\/$/, '')}${item.path}`
		: null

	const inner = url ? buildExternalLink(url, 'mention-card-link') : document.createElement('div')
	if (!url) inner.className = 'mention-card-link'

	inner.append(buildAuthorInfo(item.author, item.publishedAt))

	const p = document.createElement('p')
	p.className = 'mention-text'

	const strong = document.createElement('strong')
	strong.textContent = item.title
	p.append(strong)

	if (item.siteName) {
		p.append(' on ')
		const em = document.createElement('em')
		em.textContent = item.siteName
		p.append(em)
	}

	inner.append(p)
	li.append(inner)
	return li
}

function buildSembleCardMention(item) {
	const li = document.createElement('li')
	li.className = 'mention-card'

	const div = document.createElement('div')
	div.className = 'mention-card-link'
	div.append(buildAuthorInfo(item.author, item.createdAt))

	const p = document.createElement('p')
	p.className = 'mention-text'
	p.textContent = (item.type === 'note' && item.text) ? item.text : 'Bookmarked this article'
	div.append(p)

	li.append(div)
	return li
}

function buildSembleConnectionMention(item) {
	const li = document.createElement('li')
	li.className = 'mention-card'

	const div = document.createElement('div')
	div.className = 'mention-card-link'
	div.append(buildAuthorInfo(item.author, item.createdAt))

	const p = document.createElement('p')
	p.className = 'mention-text'

	if (item.note) {
		p.textContent = item.note
	} else if (item.target?.startsWith('http')) {
		p.append('Connected to ')
		const em = document.createElement('em')
		em.textContent = item.target
		p.append(em)
	} else {
		p.textContent = 'Connected to another resource'
	}

	div.append(p)
	li.append(div)
	return li
}

function scrollToHighlight(event, highlightId) {
	const el = document.getElementById(highlightId)
	if (!el) return

	event.preventDefault()
	el.scrollIntoView({ behavior: 'smooth', block: 'center' })
	el.classList.add('margin-inline-highlight--flash')
	el.addEventListener('animationend', () => {
		el.classList.remove('margin-inline-highlight--flash')
	}, { once: true })
}

function buildMarginHighlightMention(item) {
	const li = document.createElement('li')
	li.className = 'mention-card'

	const highlightId = getHighlightId(item.highlightText)
	const a = document.createElement('a')
	a.className = 'mention-card-link'

	if (highlightId) {
		a.href = `#${highlightId}`
		a.addEventListener('click', (event) => scrollToHighlight(event, highlightId))
	}

	a.append(buildAuthorInfo(item.author, item.createdAt))

	if (item.highlightText) {
		const bq = document.createElement('blockquote')
		bq.className = 'mention-highlight'

		if (item.color) {
			bq.style.borderLeftColor = item.color
			bq.style.background = `linear-gradient(90deg, ${item.color}14 0%, transparent 100%)`
		}

		bq.textContent = item.highlightText
		a.append(bq)
	} else {
		const p = document.createElement('p')
		p.className = 'mention-text'
		p.textContent = 'Highlighted on this page'
		a.append(p)
	}

	if (item.annotation) {
		const p = document.createElement('p')
		p.className = 'mention-annotation'
		p.textContent = item.annotation
		a.append(p)
	}

	li.append(a)
	return li
}

/** Turns one resolved mention record (as produced by `resolveRecords`) into a `<li class="mention-card">`, dispatching on `item.collection`. Returns `null` for an unrecognized collection (skipped by callers). Used by both `<article-mentions>` (preview) and `<article-mentions-detail>` (full list). */
export function buildMentionCard(item) {
	switch (item.collection) {
		case 'app.bsky.feed.post':
			return buildBskyPostMention(item)
		case 'site.standard.document':
			return buildStandardDocMention(item)
		case 'network.cosmik.card':
			return buildSembleCardMention(item)
		case 'network.cosmik.connection':
			return buildSembleConnectionMention(item)
		case 'at.margin.highlight':
		case 'at.margin.note':
			return buildMarginHighlightMention(item)
		default:
			return null
	}
}
