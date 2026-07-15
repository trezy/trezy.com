// `<article-mentions-detail>`: ports `legacy/components/ArticleMentions/
// MentionsDetail.js` (React) into a vanilla custom element -- the client-side
// behavior behind `src/pages/blog/[slug]/mentions/[collection].astro`'s
// static shell (which itself ports `legacy/app/blog/[slug]/mentions/
// [collection]/page.js`).
//
// Unlike the preview island (`article-mentions.js`, Task 24), this shows
// *every* mention for a single group -- no `PREVIEW_LIMIT` -- matching
// legacy's `fetchCollectionBacklinks(articleURL, links, collection, 200)`
// call (kept as `FETCH_LIMIT` below). Record-resolution (`resolveRecords`)
// and per-card DOM rendering (`buildMentionCard`) are reused from
// `../../lib/mention-render.js` rather than duplicated -- that module was
// extracted out of `article-mentions.js` specifically so this island could
// share the same pipeline.
//
// Resilience: a failed fetch anywhere in the chain resolves to an empty item
// list (`fetchGroupMentions`'s try/catch) rather than throwing, so the
// element always ends in a well-defined "no mentions found" state instead of
// crashing the page.
import {
	fetchAllLinks,
	fetchCollectionBacklinks,
} from '../../lib/constellation.js'
import { COLLECTION_GROUPS } from '../../lib/mentions.js'
import { resolveRecords, buildMentionCard } from '../../lib/mention-render.js'

// Mirrors legacy `MentionsDetail.js`'s per-collection
// `fetchCollectionBacklinks(articleURL, links, collection, 200)` call -- the
// detail view isn't preview-limited, but it isn't truly unbounded either.
const FETCH_LIMIT = 200

// Mirrors legacy `MentionsDetail.js`'s `ITEMS_PER_PAGE` -- how many resolved
// items are rendered per "page" as the `IntersectionObserver` sentinel comes
// into view.
const ITEMS_PER_PAGE = 20

function sortByDate(items) {
	return [...items].sort((a, b) => {
		const dateA = a.createdAt || a.publishedAt || ''
		const dateB = b.createdAt || b.publishedAt || ''

		return dateB.localeCompare(dateA)
	})
}

/** Fetches + resolves every mention across a group's collections for `articleURL`, sorted newest-first. Returns `[]` (rather than throwing) on any failure. */
async function fetchGroupMentions(articleURL, group) {
	try {
		const links = await fetchAllLinks(articleURL)

		const allItems = await Promise.all(
			group.collections.map(async (collection) => {
				const backlinks = await fetchCollectionBacklinks(articleURL, links, collection, FETCH_LIMIT)
				return resolveRecords(collection, backlinks)
			}),
		)

		return sortByDate(allItems.flat())
	} catch (error) {
		console.error('[MentionsDetail] Failed to load mentions:', error)
		return []
	}
}

class ArticleMentionsDetail extends HTMLElement {
	async connectedCallback() {
		this.status = this.querySelector('[data-role="status"]')
		this.count = this.querySelector('[data-role="count"]')
		this.list = this.querySelector('[data-role="mention-list"]')
		this.sentinel = this.querySelector('[data-role="sentinel"]')

		this._items = []
		this._visibleCount = ITEMS_PER_PAGE
		this._observer = null

		const articleURL = this.dataset.articleUrl
		const group = COLLECTION_GROUPS.find(g => g.id === this.dataset.groupId)

		if (!articleURL || !group) {
			this.showEmpty()
			return
		}

		try {
			this._items = await fetchGroupMentions(articleURL, group)
		} catch (error) {
			// Belt-and-suspenders, mirroring `article-mentions.js`:
			// `fetchGroupMentions()` already swallows its own network failures,
			// but a DOM-side surprise here should still degrade to "no mentions
			// found" rather than an uncaught rejection.
			console.error('[MentionsDetail] Failed to render mentions:', error)
			this._items = []
		}

		if (this._items.length === 0) {
			this.showEmpty()
			return
		}

		this.showItems()
	}

	disconnectedCallback() {
		this._observer?.disconnect()
		this._observer = null
	}

	showEmpty() {
		if (this.status) {
			this.status.textContent = 'No mentions found.'
			this.status.hidden = false
		}
	}

	showItems() {
		if (this.status) this.status.hidden = true

		if (this.count) {
			this.count.hidden = false
			this.count.textContent = `${this._items.length} ${this._items.length === 1 ? 'mention' : 'mentions'}`
		}

		if (!this.list) return

		this.list.hidden = false
		this.renderVisible()
		this.setupSentinel()
	}

	renderVisible() {
		const visible = this._items.slice(0, this._visibleCount)
		const cards = visible.map(buildMentionCard).filter(Boolean)
		this.list.replaceChildren(...cards)
	}

	/** Sets up an `IntersectionObserver` on the sentinel element to grow `_visibleCount` by `ITEMS_PER_PAGE` as the reader scrolls near the bottom of the currently-rendered list -- mirrors legacy `MentionsDetail.js`'s `useEffect`-driven infinite scroll. Hides the sentinel and disconnects once every item is visible. */
	setupSentinel() {
		if (!this.sentinel) return

		if (this._visibleCount >= this._items.length) {
			this.sentinel.hidden = true
			return
		}

		this.sentinel.hidden = false

		this._observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return

			this._visibleCount = Math.min(this._visibleCount + ITEMS_PER_PAGE, this._items.length)
			this.renderVisible()

			if (this._visibleCount >= this._items.length) {
				this._observer?.disconnect()
				this._observer = null
				this.sentinel.hidden = true
			}
		}, { rootMargin: '200px' })

		this._observer.observe(this.sentinel)
	}
}

customElements.define('article-mentions-detail', ArticleMentionsDetail)
