// Module imports
import { Agent, CredentialSession } from '@atproto/api'
import { TID } from '@atproto/common-web'





// Local imports
import { markdownToLeaflet } from './markdownToLeaflet.js'
import { stripMarkdown } from './stripMarkdown.js'





// Local constants
const PUBLICATION_NSID = 'site.standard.publication'
const DOCUMENT_NSID = 'site.standard.document'

let cachedAgent = null





async function getAgent() {
	if (cachedAgent) {
		return cachedAgent
	}

	const pdsUrl = process.env.ATPROTO_PDS_URL || 'https://bsky.social'
	const session = new CredentialSession(new URL(pdsUrl))

	await session.login({
		identifier: process.env.ATPROTO_HANDLE,
		password: process.env.ATPROTO_PASSWORD,
	})

	cachedAgent = new Agent(session)
	return cachedAgent
}

async function listAllRecords(agent, collection) {
	const records = []
	let cursor

	do {
		const response = await agent.com.atproto.repo.listRecords({
			repo: agent.assertDid,
			collection,
			limit: 100,
			cursor,
		})

		records.push(...response.data.records)
		cursor = response.data.cursor
	} while (cursor)

	return records
}

export async function ensurePublication() {
	const agent = await getAgent()
	const records = await listAllRecords(agent, PUBLICATION_NSID)

	const configuredRkey = process.env.ATPROTO_PUBLICATION_RKEY
	if (configuredRkey) {
		const match = records.find((record) => record.uri.endsWith(`/${configuredRkey}`))
		if (!match) {
			throw new Error(`[StandardSite] No publication record found with rkey "${configuredRkey}"`)
		}
		return match.uri
	}

	if (records.length > 0) {
		return records[0].uri
	}

	const rkey = TID.nextStr()
	const response = await agent.com.atproto.repo.createRecord({
		repo: agent.assertDid,
		collection: PUBLICATION_NSID,
		rkey,
		record: {
			$type: PUBLICATION_NSID,
			name: '<trezy-who/>',
			url: 'https://trezy.codes',
			description: 'Trezy\'s blog about web development, game development, and other nerdy things.',
		},
	})

	return response.data.uri
}

async function uploadCoverImage(agent, article) {
	if (!article.headerImage) {
		return undefined
	}

	const imageUrl = article.headerImage.fields
		? `https:${article.headerImage.fields.file.url}`
		: `https:${article.headerImage.file.url}`

	const imageResponse = await fetch(imageUrl)
	const imageBuffer = await imageResponse.arrayBuffer()
	const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

	const blobResponse = await agent.com.atproto.repo.uploadBlob(
		new Uint8Array(imageBuffer),
		{ encoding: contentType },
	)

	return blobResponse.data.blob
}

async function resolveImagePlaceholders(agent, content, imagePlaceholders) {
	for (const placeholder of imagePlaceholders) {
		try {
			const imageUrl = placeholder.src.startsWith('//')
				? `https:${placeholder.src}`
				: placeholder.src

			const imageResponse = await fetch(imageUrl)
			const imageBuffer = await imageResponse.arrayBuffer()
			const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

			const blobResponse = await agent.com.atproto.repo.uploadBlob(
				new Uint8Array(imageBuffer),
				{ encoding: contentType },
			)

			const page = content.pages[0]
			const block = page.blocks[placeholder.blockIndex].block

			// Remove placeholder markers
			delete block.__placeholder
			delete block.__src
			delete block.__alt

			// Set real image data
			block.image = blobResponse.data.blob
			block.aspectRatio = { width: 1, height: 1 }
			if (placeholder.alt) {
				block.alt = placeholder.alt
			}
		} catch (error) {
			console.error(`[StandardSite] Failed to upload content image: ${error.message}`)
			// Remove the broken image block
			content.pages[0].blocks.splice(placeholder.blockIndex, 1)
		}
	}
}

function buildRecord(publicationUri, article, coverImage, content) {
	const record = {
		$type: DOCUMENT_NSID,
		site: publicationUri,
		title: article.title,
		path: `/blog/${article.slug}`,
		publishedAt: new Date(article.createdAt).toISOString(),
	}

	if (article.synopsis) {
		record.description = article.synopsis
	}

	if (article.body) {
		record.textContent = stripMarkdown(article.body)
	}

	if (article.updatedAt) {
		record.updatedAt = new Date(article.updatedAt).toISOString()
	}

	if (coverImage) {
		record.coverImage = coverImage
	}

	if (content) {
		record.content = content
	}

	return record
}

async function writeRecord(agent, record, existingRecord) {
	if (existingRecord) {
		const rkey = existingRecord.uri.split('/').pop()
		await agent.com.atproto.repo.putRecord({
			repo: agent.assertDid,
			collection: DOCUMENT_NSID,
			rkey,
			record,
		})
	} else {
		const rkey = TID.nextStr()
		await agent.com.atproto.repo.createRecord({
			repo: agent.assertDid,
			collection: DOCUMENT_NSID,
			rkey,
			record,
		})
	}
}

export async function syncArticle(article) {
	const agent = await getAgent()
	const publicationUri = await ensurePublication()

	const existingRecords = await listAllRecords(agent, DOCUMENT_NSID)
	const existingRecord = existingRecords.find(
		(record) => record.value.path === `/blog/${article.slug}`,
	)

	let coverImage
	try {
		coverImage = await uploadCoverImage(agent, article)
	} catch (error) {
		console.error('[StandardSite] Failed to upload cover image:', error.message)
	}

	let content
	if (article.body) {
		const { content: leafletContent, imagePlaceholders } = markdownToLeaflet(article.body)
		if (imagePlaceholders.length > 0) {
			await resolveImagePlaceholders(agent, leafletContent, imagePlaceholders)
		}
		content = leafletContent
	}

	const record = buildRecord(publicationUri, article, coverImage, content)
	await writeRecord(agent, record, existingRecord)
}

export async function getArticleAtprotoRef(slug) {
	try {
		const agent = await getAgent()
		const records = await listAllRecords(agent, DOCUMENT_NSID)

		const record = records.find(
			(r) => r.value.path === `/blog/${slug}`,
		)

		if (!record) return null

		return {
			uri: record.uri,
			cid: record.cid,
		}
	} catch (error) {
		console.error('[StandardSite] Failed to get article AT Protocol ref:', error.message)
		return null
	}
}

export async function deleteArticle(slug) {
	const agent = await getAgent()
	const records = await listAllRecords(agent, DOCUMENT_NSID)

	const existingRecord = records.find(
		(record) => record.value.path === `/blog/${slug}`,
	)

	if (existingRecord) {
		const rkey = existingRecord.uri.split('/').pop()
		await agent.com.atproto.repo.deleteRecord({
			repo: agent.assertDid,
			collection: DOCUMENT_NSID,
			rkey,
		})
	}
}
