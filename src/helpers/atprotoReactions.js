import { TID } from '@atproto/common-web'

const REACTION_NSID = 'codes.trezy.reaction'

export async function createReaction(agent, articleAtUri, articleCid, reactionType) {
	const rkey = TID.nextStr()

	const response = await agent.com.atproto.repo.createRecord({
		repo: agent.assertDid,
		collection: REACTION_NSID,
		rkey,
		record: {
			$type: REACTION_NSID,
			subject: {
				uri: articleAtUri,
				cid: articleCid,
			},
			type: reactionType,
			createdAt: new Date().toISOString(),
		},
	})

	return {
		uri: response.data.uri,
		cid: response.data.cid,
		rkey,
	}
}

export async function deleteReaction(agent, rkey) {
	await agent.com.atproto.repo.deleteRecord({
		repo: agent.assertDid,
		collection: REACTION_NSID,
		rkey,
	})
}

export async function listReactions(agent, articleAtUri) {
	const records = []
	let cursor

	do {
		const response = await agent.com.atproto.repo.listRecords({
			repo: agent.assertDid,
			collection: REACTION_NSID,
			limit: 100,
			cursor,
		})

		records.push(...response.data.records)
		cursor = response.data.cursor
	} while (cursor)

	return records.filter(record => record.value.subject.uri === articleAtUri)
}
