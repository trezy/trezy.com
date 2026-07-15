// Blog helper library: article title formatting, URL building, and sorting.
//
// `articleTitle` ports `legacy/helpers/createTitleStringFromArticle.js`
// (title + ' - ' + subtitle when a subtitle is present).
//
// `getArticleURL` mirrors `legacy/helpers/getArticleURL.js`'s relative-URL
// shape (`/blog/<slug>`), using the local content collection entry's `id`
// (the filename-derived slug) in place of Contentful's `article.slug`.
//
// `sortArticles` mirrors the ordering from legacy `getAllArticles`
// (`-sys.createdAt,-fields.legacyPublishedAt,-fields.legacyCreatedAt`, i.e.
// newest first) using the local schema's `publishedAt` falling back to
// `createdAt`. It's kept pure/synchronous so it can be unit tested without
// the `astro:content` runtime; `getSortedArticles` is a thin async wrapper
// around `getCollection` + `sortArticles`.

export function articleTitle(entry) {
	if (!entry) {
		return ''
	}

	const { title, subtitle } = entry.data ?? {}

	if (subtitle) {
		return `${title} - ${subtitle}`
	}

	return title
}

export function getArticleURL(entry) {
	return `/blog/${entry.id}`
}

function bestDate(entry) {
	return entry.data?.publishedAt ?? entry.data?.createdAt ?? 0
}

export function sortArticles(entries) {
	return [...entries].sort((a, b) => new Date(bestDate(b)) - new Date(bestDate(a)))
}

export async function getSortedArticles() {
	const { getCollection } = await import('astro:content')
	const entries = await getCollection('blog', ({ data }) => !data.draft)

	return sortArticles(entries)
}
