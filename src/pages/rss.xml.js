// RSS feed at /rss.xml.
//
// Ports legacy/pages/api/blog/rss.js (channel title/description/language/ttl/
// managingEditor/webMaster/copyright, and per-item title/link/description/
// pubDate) onto @astrojs/rss + the local content collection.

import rss from '@astrojs/rss'
import { getSortedArticles, getArticleURL, articleTitle } from '../lib/blog.js'

export async function GET(context) {
	const articles = await getSortedArticles()

	return rss({
		title: 'Trezy.com',
		description: 'New ideas, old ideas, and regular ideas can all be found below the titles of Trezy\'s titular technological tidings.',
		site: context.site,
		items: articles.map(entry => {
			return {
				title: articleTitle(entry),
				description: entry.data.synopsis,
				link: getArticleURL(entry),
				pubDate: entry.data.publishedAt ?? entry.data.createdAt,
			}
		}),
		customData: [
			'<language>en-us</language>',
			'<ttl>10</ttl>',
			'<docs>https://www.rssboard.org/rss-specification</docs>',
			'<managingEditor>t@trezy.com</managingEditor>',
			'<webMaster>t@trezy.com</webMaster>',
			`<copyright>Copyright ${(new Date()).getFullYear()}, Trezy Studios, LLC</copyright>`,
		].join(''),
	})
}
