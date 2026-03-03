// Module imports
import { Agent, CredentialSession } from '@atproto/api'
import { TID } from '@atproto/common-web'





// Local imports
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

function buildRecord(publicationUri, article, coverImage) {
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

	const record = buildRecord(publicationUri, article, coverImage)
	await writeRecord(agent, record, existingRecord)
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
