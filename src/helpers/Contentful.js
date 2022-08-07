// Module imports
import { createClient as createContentfulClient } from 'contentful'





// Local imports
import { calculateReadtime } from './calculateReadtime.js'
import * as DevTo from './DevTo.js'
import * as Hashnode from './Hashnode.js'





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

	if (contentfulResponse.total === 0) {
		return null
	}

	const article = parseArticle(contentfulResponse.items[0])

	if (article.devToID) {
		const devToArticle = await DevTo.getArticle(article.devToID)

		article.devToReactions = devToArticle.positive_reactions_count
		article.devToURL = devToArticle.url
	}

	if (article.hashnodeSlug) {
		try {
			const hashnodeArticle = await Hashnode.getArticle(article.hashnodeSlug)

			article.hashnodeReactions = hashnodeArticle.data.post.totalReactions
			article.hashnodeURL = `${hashnodeArticle.data.post.publication.domain || 'https://hashnode.com'}/${article.hashnodeSlug}`
		} catch (error) {}
	}

	return article
}

export async function getArticleByID(id, isPreview) {
	const contentfulClient = getClient(isPreview)
	const article = await contentfulClient.getEntry(id)

	if (!article) {
		return null
	}

	return parseArticle(article)
}
