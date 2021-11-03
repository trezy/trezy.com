// Module imports
import { createClient as createContentfulClient } from 'contentful'





// Component imports
import { calculateReadtime } from 'helpers/calculateReadtime'





function getClient() {
	return createContentfulClient({
		space: process.env.CONTENTFUL_API_SPACE_ID,
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
	})
}

function parseArticle(article) {
	return {
		...article.fields,
		id: article.sys.id,
		createdAt: article.fields.legacyPublishedAt || article.fields.legacyCreatedAt || article.sys.createdAt,
		readtime: calculateReadtime(article.fields.body),
		updatedAt: article.sys.updatedAt,
	}
}

export async function getAllArticles() {
	const contentfulClient = getClient()
	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
			order: '-fields.legacyPublishedAt,-fields.legacyCreatedAt,-sys.createdAt',
		})

	return contentfulResponse.items.map(parseArticle)
}
