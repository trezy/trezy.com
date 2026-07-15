// `<article-mentions>`: ports `legacy/components/ArticleMentions/index.js`
// (React) + `api.js` (fetch/resolve) + `CollectionPreview.js`/
// `MentionCard.js` (rendering) into a vanilla custom element.
//
// Network helpers reused from `../../lib/constellation.js` (Task 22) rather
// than duplicated: `fetchAllLinks`, `getCollectionTotal`,
// `fetchCollectionBacklinks` (exported for this task). Pure
// collection-grouping/highlight-id logic reused from `../../lib/mentions.js`
// (this task, unit-tested in `mentions.test.js`). Record-resolution
// (`resolveRecords`) and mention-card DOM rendering (`buildMentionCard`) are
// reused from `../../lib/mention-render.js` (Task 24b) -- that module was
// extracted out of this file so `<article-mentions-detail>`
// (`article-mentions-detail.js`, Task 24b) could share the exact same
// resolve/render pipeline instead of duplicating it a second time.
//
// Task 24b also restores legacy `CollectionPreview.js`'s "View all →" link
// (see `buildCollectionPreview`, below) to `/blog/<slug>/mentions/<group>`,
// which Task 24 had intentionally omitted pending that route's existence.
//
// Resilience: every network-touching step degrades to "no mentions" rather
// than throwing -- a failed fetch anywhere in the chain leaves the element
// `hidden` (its initial state in `ArticleMentions.astro`) instead of
// crashing the page.
import {
	fetchAllLinks,
	fetchCollectionBacklinks,
	getCollectionTotal,
} from '../../lib/constellation.js'
import {
	COLLECTION_GROUPS,
	SUPPORTED_COLLECTIONS,
	getHighlightId,
} from '../../lib/mentions.js'
import { resolveRecords, buildMentionCard } from '../../lib/mention-render.js'

const PREVIEW_LIMIT = 5

/** Fetches + groups backlink previews for `articleURL`, per `COLLECTION_GROUPS`. Returns `{ groups: [] }` (rather than throwing) on any failure. */
async function fetchCollectionPreviews(articleURL, previewLimit = PREVIEW_LIMIT) {
	try {
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
	} catch (error) {
		console.error('[Mentions] Failed to load mentions:', error)
		return { groups: [], links: {} }
	}
}

// ---------------------------------------------------------------------------
// DOM rendering (ported from legacy `CollectionPreview.js`; per-card rendering
// itself lives in `../../lib/mention-render.js`'s `buildMentionCard`)
// ---------------------------------------------------------------------------

/** Builds one `.collection-preview` block (group header + preview cards). When `group.total` exceeds the number of preview `items` shown, appends a "View all →" link to `/blog/<articleSlug>/mentions/<group.id>` (`src/pages/blog/[slug]/mentions/[collection].astro`, Task 24b) -- ported from legacy `CollectionPreview.js`. */
function buildCollectionPreview(group, articleSlug) {
	const div = document.createElement('div')
	div.className = 'collection-preview'
	div.dataset.collection = group.id

	const header = document.createElement('div')
	header.className = 'collection-preview-header'

	const name = document.createElement('span')
	name.className = 'collection-name'
	name.textContent = group.name

	const total = document.createElement('span')
	total.className = 'collection-total'
	total.textContent = `${group.total} ${group.total === 1 ? 'mention' : 'mentions'}`

	header.append(name, total)
	div.append(header)

	const ul = document.createElement('ul')
	ul.className = 'collection-preview-list'

	for (const item of group.items) {
		const card = buildMentionCard(item)
		if (card) ul.append(card)
	}

	div.append(ul)

	if (articleSlug && group.total > group.items.length) {
		const link = document.createElement('a')
		link.className = 'collection-more'
		link.href = `/blog/${articleSlug}/mentions/${encodeURIComponent(group.id)}`
		link.textContent = 'View all →'
		div.append(link)
	}

	return div
}

// ---------------------------------------------------------------------------
// In-DOM Margin highlight rendering (ported from legacy `index.js`)
// ---------------------------------------------------------------------------

function isMarginExtensionInstalled() {
	return !!(
		document.querySelector('[data-margin]')
		|| document.querySelector('[data-margin-extension]')
		|| document.getElementById('margin-root')
	)
}

function highlightTextInDOM(container, highlight) {
	const { highlightText: text, color, author, annotation } = highlight
	if (!text || text.length < 10) return

	const walker = document.createTreeWalker(
		container,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				const parent = node.parentElement

				if (parent?.tagName === 'SCRIPT' || parent?.tagName === 'STYLE' || parent?.tagName === 'MARK') {
					return NodeFilter.FILTER_REJECT
				}

				return NodeFilter.FILTER_ACCEPT
			},
		},
	)

	let node = walker.nextNode()

	while (node) {
		const idx = node.textContent.indexOf(text)

		if (idx !== -1) {
			const range = document.createRange()
			range.setStart(node, idx)
			range.setEnd(node, idx + text.length)

			const mark = document.createElement('mark')
			mark.className = 'margin-inline-highlight'
			mark.id = getHighlightId(text)

			if (color) {
				mark.style.backgroundColor = `${color}26`
				mark.style.borderBottomColor = `${color}80`
			}

			try {
				range.surroundContents(mark)
			} catch {
				// skip highlights that span multiple DOM nodes
				return
			}

			if (author?.avatar) {
				const img = document.createElement('img')
				img.className = 'margin-inline-avatar'
				img.src = author.avatar
				img.alt = author.displayName || author.handle || ''
				mark.parentNode.insertBefore(img, mark)
			}

			if (annotation) {
				const note = document.createElement('span')
				note.className = 'margin-inline-note'
				note.textContent = annotation
				mark.after(note)
			}

			return
		}

		node = walker.nextNode()
	}
}

// ---------------------------------------------------------------------------
// Custom element
// ---------------------------------------------------------------------------

class ArticleMentions extends HTMLElement {
	async connectedCallback() {
		this.grid = this.querySelector('[data-role="collection-grid"]')
		this._marginCleanup = null

		const articleURL = this.resolveArticleURL()
		if (!articleURL) return

		const articleSlug = this.resolveArticleSlug(articleURL)

		try {
			const data = await fetchCollectionPreviews(articleURL)

			if (!data.groups.length) return

			this.render(data.groups, articleSlug)
			this.hidden = false

			this.highlightMarginMentions(data.groups)
		} catch (error) {
			// Belt-and-suspenders: `fetchCollectionPreviews()` already swallows
			// its own network failures, but a DOM-side surprise here (e.g. an
			// unexpected record shape) should still degrade to "no mentions
			// shown" rather than surface as an uncaught rejection.
			console.error('[Mentions] Failed to render mentions:', error)
		}
	}

	disconnectedCallback() {
		this._marginCleanup?.()
		this._marginCleanup = null
	}

	/** `data-article-url` (absolute canonical URL, set by `ArticleMentions.astro`) wins; falls back to the page's `<link rel="canonical">`. */
	resolveArticleURL() {
		return this.dataset.articleUrl
			|| document.querySelector('link[rel="canonical"]')?.href
			|| null
	}

	/** Derives the blog article's slug (e.g. `the-marshmallow-test`) from its resolved article URL -- the last non-empty path segment -- for building "View all →" links to `/blog/<slug>/mentions/<group>`. Returns `null` for a malformed URL rather than throwing. */
	resolveArticleSlug(articleURL) {
		try {
			const path = new URL(articleURL).pathname
			const segments = path.split('/').filter(Boolean)
			return segments.at(-1) || null
		} catch {
			return null
		}
	}

	render(groups, articleSlug) {
		if (!this.grid) return
		this.grid.replaceChildren(...groups.map(group => buildCollectionPreview(group, articleSlug)))
	}

	/** Wraps matching text in the article body in `<mark>` for each `margin` group item, unless a Margin browser extension is already installed (it'll do its own in-page highlighting). Skipped entirely if there's no margin group or no article body container found. */
	highlightMarginMentions(groups) {
		if (isMarginExtensionInstalled()) return

		const marginGroup = groups.find(g => g.id === 'margin')
		if (!marginGroup || marginGroup.items.length === 0) return

		const articleEl = document.querySelector('article .container')
		if (!articleEl) return

		for (const highlight of marginGroup.items) {
			highlightTextInDOM(articleEl, highlight)
		}

		this._marginCleanup = () => {
			document.querySelectorAll('.margin-inline-avatar, .margin-inline-note').forEach(el => el.remove())

			document.querySelectorAll('mark.margin-inline-highlight').forEach(mark => {
				const parent = mark.parentNode
				parent?.replaceChild(document.createTextNode(mark.textContent), mark)
				parent?.normalize()
			})
		}
	}
}

customElements.define('article-mentions', ArticleMentions)
