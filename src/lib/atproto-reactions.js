// Ported verbatim (logic-wise) from `legacy/helpers/atprotoReactions.js`.
//
// Writes reactions to the logged-in user's own PDS as `codes.trezy.reaction`
// records; there is no server involved. Aggregate counts are read back out
// via Constellation (see `./constellation.js`), not from these functions.

import { TID } from '@atproto/common-web'

const REACTION_NSID = 'codes.trezy.reaction'

// Order matters: this is the canonical display/iteration order for the six
// supported reaction types (see project constraints).
export const REACTION_TYPES = ['heart', 'clap', 'rocket', 'sack-dollar', 'trophy', 'fire']

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

export async function listUserReactions(agent, articleAtUri) {
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

// Alias for parity with the legacy helper's original export name.
export const listReactions = listUserReactions

// Pure helper: given an array of reaction records (each shaped like the
// records returned by `listUserReactions`/Constellation, i.e. `{ value: { type } }`),
// tally how many of each of the six known reaction types are present.
// Records with a missing/unknown `type` are ignored.
export function aggregateReactionCounts(records) {
	const counts = {}

	for (const record of records) {
		const type = record?.value?.type

		if (!REACTION_TYPES.includes(type)) continue

		counts[type] = (counts[type] || 0) + 1
	}

	return counts
}
