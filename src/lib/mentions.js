// Pure (DOM/network-free) helpers for the `<article-mentions>` island, ported
// from `legacy/components/ArticleMentions/api.js`. Kept separate from
// `src/components/islands/article-mentions.js` (which does the actual
// fetching/DOM work) so the collection-grouping logic and the highlight-id
// hash are unit-testable in isolation (see `mentions.test.js`).
//
// Network/backlink-resolution helpers (`fetchAllLinks`, `getCollectionTotal`,
// per-source backlink fetching, PDS resolution) already live in
// `./constellation.js` (Task 22) -- this module does NOT duplicate them. The
// island imports both this module and `constellation.js`.

// The six atproto collections the mentions island understands, in the same
// order legacy's `SUPPORTED_COLLECTIONS` used.
export const SUPPORTED_COLLECTIONS = [
	'app.bsky.feed.post',
	'site.standard.document',
	'network.cosmik.card',
	'network.cosmik.connection',
	'at.margin.highlight',
	'at.margin.note',
]

// Groups collections into the four preview sections legacy rendered
// (`CollectionPreview.js`), in display order.
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

// Collection -> group-id lookup, derived from `COLLECTION_GROUPS` (kept as a
// literal object, like legacy's `COLLECTION_META`, rather than computed, so
// it can be spot-checked against `COLLECTION_GROUPS` directly in tests).
export const COLLECTION_META = {
	'app.bsky.feed.post': { group: 'bluesky' },
	'site.standard.document': { group: 'articles' },
	'network.cosmik.card': { group: 'semble' },
	'network.cosmik.connection': { group: 'semble' },
	'at.margin.highlight': { group: 'margin' },
	'at.margin.note': { group: 'margin' },
}

// Maps a collection id to its group id (e.g. `'app.bsky.feed.post'` ->
// `'bluesky'`), or `undefined` if the collection isn't one of
// `SUPPORTED_COLLECTIONS`.
export function getGroupForCollection(collection) {
	return COLLECTION_META[collection]?.group
}

// Deterministic hash of highlight text -> a stable DOM id (`hl-<base36>`),
// ported verbatim from legacy so any previously-shared `#hl-<id>` deep links
// keep resolving. Used both to `id` the `<mark>` wrapping a margin highlight
// in the article body, and to link a `MentionCard` to that `<mark>`.
export function getHighlightId(text) {
	if (!text) return null
	let hash = 0

	for (let i = 0; i < text.length; i++) {
		hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
	}

	return `hl-${(hash >>> 0).toString(36)}`
}
