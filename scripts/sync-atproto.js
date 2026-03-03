const { Agent, CredentialSession } = require('@atproto/api')
const { TID } = require('@atproto/common-web')
const { createClient } = require('contentful')

const PUBLICATION_NSID = 'site.standard.publication'
const DOCUMENT_NSID = 'site.standard.document'

function stripMarkdown(markdown) {
	return markdown
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
		.replace(/~~(.*?)~~/g, '$1')
		.replace(/^>\s+/gm, '')
		.replace(/^[-*_]{3,}\s*$/gm, '')
		.replace(/<[^>]+>/g, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
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

function parseArticle(article) {
	return {
		...article.fields,
		id: article.sys.id,
		createdAt: article.fields.legacyPublishedAt || article.fields.legacyCreatedAt || article.sys.createdAt,
		updatedAt: article.sys.updatedAt,
	}
}

async function main() {
	// Authenticate with atproto
	const pdsUrl = process.env.ATPROTO_PDS_URL || 'https://bsky.social'
	const session = new CredentialSession(new URL(pdsUrl))

	await session.login({
		identifier: process.env.ATPROTO_HANDLE,
		password: process.env.ATPROTO_PASSWORD,
	})

	const agent = new Agent(session)
	console.log(`Authenticated as ${agent.assertDid}`)

	// Ensure publication exists
	const pubRecords = await listAllRecords(agent, PUBLICATION_NSID)
	let publicationUri

	if (pubRecords.length > 0) {
		publicationUri = pubRecords[0].uri
		console.log(`Found existing publication: ${publicationUri}`)
	} else {
		const rkey = TID.nextStr()
		const response = await agent.com.atproto.repo.createRecord({
			repo: agent.assertDid,
			collection: PUBLICATION_NSID,
			rkey,
			record: {
				$type: PUBLICATION_NSID,
				name: '<trezy-who/>',
				url: 'https://trezy.codes',
				description: "Trezy's blog about web development, game development, and other nerdy things.",
			},
		})
		publicationUri = response.data.uri
		console.log(`Created publication: ${publicationUri}`)
	}

	// Fetch existing document records
	const existingRecords = await listAllRecords(agent, DOCUMENT_NSID)
	console.log(`Found ${existingRecords.length} existing document records`)

	// Fetch all articles from Contentful
	const contentfulClient = createClient({
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
		space: process.env.CONTENTFUL_API_SPACE_ID,
	})

	const contentfulResponse = await contentfulClient.getEntries({
		content_type: 'article',
		order: '-sys.createdAt',
	})

	const articles = contentfulResponse.items.map(parseArticle)
	console.log(`Found ${articles.length} articles in Contentful\n`)

	// Sync each article
	let synced = 0
	let errors = 0

	for (const article of articles) {
		try {
			const existingRecord = existingRecords.find(
				(record) => record.value.path === `/blog/${article.slug}`,
			)

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

			// Upload cover image
			if (article.headerImage) {
				try {
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

					record.coverImage = blobResponse.data.blob
				} catch (error) {
					console.error(`  Warning: Failed to upload cover image: ${error.message}`)
				}
			}

			if (existingRecord) {
				const rkey = existingRecord.uri.split('/').pop()
				await agent.com.atproto.repo.putRecord({
					repo: agent.assertDid,
					collection: DOCUMENT_NSID,
					rkey,
					record,
				})
				console.log(`  Updated: ${article.slug}`)
			} else {
				const rkey = TID.nextStr()
				await agent.com.atproto.repo.createRecord({
					repo: agent.assertDid,
					collection: DOCUMENT_NSID,
					rkey,
					record,
				})
				console.log(`  Created: ${article.slug}`)
			}

			synced++
		} catch (error) {
			console.error(`  Error syncing ${article.slug}: ${error.message}`)
			errors++
		}
	}

	console.log(`\nDone! Synced: ${synced}, Errors: ${errors}`)
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
