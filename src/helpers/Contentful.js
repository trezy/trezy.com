// Module imports
import { createClient as createContentfulClient } from 'contentful'





// Component imports
import { calculateReadtime } from 'helpers/calculateReadtime'





function getClient(isPreview = false) {
	const clientConfig = {
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
		space: process.env.CONTENTFUL_API_SPACE_ID,
	}

	if (isPreview) {
		clientConfig.accessToken = process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN
		clientConfig.host = 'preview.contentful.com'
	}

	return createContentfulClient(clientConfig)
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
			order: '-sys.createdAt,-fields.legacyPublishedAt,-fields.legacyCreatedAt',
		})

	return contentfulResponse.items.map(parseArticle)
}

export async function getArticle(slug, isPreview) {
	const contentfulClient = getClient(isPreview)
	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
			'fields.slug': slug,
			limit: 1,
		})

	if (!contentfulResponse.total === 0) {
		return null
	}

	return parseArticle(contentfulResponse.items[0])
}
