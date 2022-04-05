// Module imports
import xml from 'xml'





// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import * as Contentful from 'helpers/Contentful'





async function handler(request, response) {
	const articles = await Contentful.getAllArticles()

	response.setHeader('cache-control', 'max-age=0, s-maxage=600')
	response.setHeader('content-type', 'text/xml')
	response.status(httpStatus.OK)
	response.send(xml({
		rss: [
			{
				_attr: {
					version: '2.0',
				},
			},
			{
				channel: [
					{ title: 'Trezy.com' },
					{ link: 'https://trezy.com/blog' },
					{ description: 'New ideas, old ideas, and regular ideas can all be found below the titles of Trezy\'s titular technological tidings.' },
					{ language: 'en-us' },
					{ pubDate: (new Date(articles[0].createdAt)).toGMTString() },
					{ lastBuildDate: (new Date(articles[0].updatedAt)).toGMTString() },
					{ docs: 'https://www.rssboard.org/rss-specification' },
					{ managingEditor: 't@trezy.com' },
					{ webMaster: 't@trezy.com' },
					{ copyright: `Copyright ${(new Date()).getFullYear()}, Trezy Studios, LLC` },
					{ category: '' },
					{ ttl: 10 },
					...articles.map(article => {
						return {
							item: [
								{ title: article.title },
								{ link: `https://trezy.com/blog/${article.slug}` },
								{ description: article.synopsis },
								{ pubDate: (new Date(article.createdAt)).toGMTString() },
								{ author: 't@trezy.com (Trezy)' },
								{ guid: article.title },
							],
						}
					})
				],
			},
		],
	}, {
		declaration: true,
		indent: '\t',
	}))
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
