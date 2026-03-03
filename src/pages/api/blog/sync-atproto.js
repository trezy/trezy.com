// Local imports
import * as Contentful from 'helpers/Contentful'
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { syncArticle } from 'helpers/StandardSite'





async function handler(request, response) {
	if (request.headers['x-contentful-api-token'] !== process.env.CONTENTFUL_API_ACCESS_TOKEN) {
		response.status(httpStatus.UNAUTHORIZED)
		return response.json({ message: 'Invalid token' })
	}

	try {
		const articles = await Contentful.getAllArticles()
		const results = []

		for (const article of articles) {
			try {
				await syncArticle(article)
				results.push({ slug: article.slug, status: 'synced' })
			} catch (error) {
				results.push({ slug: article.slug, status: 'error', error: error.message })
			}
		}

		response.status(httpStatus.OK)
		response.json({
			total: articles.length,
			synced: results.filter((r) => r.status === 'synced').length,
			errors: results.filter((r) => r.status === 'error').length,
			results,
		})
	} catch (error) {
		console.error('[sync-atproto] Failed to fetch articles:', error)
		response.status(500).json({ message: 'Failed to sync articles', error: error.message })
	}
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
