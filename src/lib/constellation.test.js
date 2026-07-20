import { describe, it, expect } from 'vitest'
import { aggregateReactionCounts } from './atproto-reactions.js'
import { getCollectionTotal, getCollectionTotalMulti } from './constellation.js'

describe('aggregateReactionCounts', () => {
	it('counts records by reaction type', () => {
		const records = [
			{ value: { type: 'heart' } },
			{ value: { type: 'heart' } },
			{ value: { type: 'clap' } },
			{ value: { type: 'fire' } },
		]

		expect(aggregateReactionCounts(records)).toEqual({
			heart: 2,
			clap: 1,
			fire: 1,
		})
	})

	it('ignores records with unknown/invalid reaction types', () => {
		const records = [
			{ value: { type: 'heart' } },
			{ value: { type: 'not-a-real-reaction-type' } },
			{ value: {} },
		]

		expect(aggregateReactionCounts(records)).toEqual({ heart: 1 })
	})

	it('returns an empty object for an empty input', () => {
		expect(aggregateReactionCounts([])).toEqual({})
	})

	it('counts all six known reaction types independently', () => {
		const records = ['heart', 'clap', 'rocket', 'sack-dollar', 'trophy', 'fire']
			.map(type => ({ value: { type } }))

		expect(aggregateReactionCounts(records)).toEqual({
			heart: 1,
			clap: 1,
			rocket: 1,
			'sack-dollar': 1,
			trophy: 1,
			fire: 1,
		})
	})
})

describe('getCollectionTotal', () => {
	it('sums records across all sources for a collection', () => {
		const links = {
			'codes.trezy.reaction': {
				'.subject.uri': { records: 3 },
				'app.bsky.feed.post:.subject.uri': { records: 2 },
			},
		}

		expect(getCollectionTotal(links, 'codes.trezy.reaction')).toBe(5)
	})

	it('returns 0 when the collection is absent from links', () => {
		expect(getCollectionTotal({}, 'codes.trezy.reaction')).toBe(0)
	})

	it('returns 0 when the collection is present but has no sources', () => {
		const links = { 'codes.trezy.reaction': {} }
		expect(getCollectionTotal(links, 'codes.trezy.reaction')).toBe(0)
	})
})

describe('getCollectionTotalMulti', () => {
	it('sums a collection total across every target', () => {
		// e.g. the same article mentioned under two domains: 23 on one, 12 on
		// the other -> 35 combined.
		const perTarget = [
			{ url: 'https://trezy.com/blog/x', links: { 'app.bsky.feed.post': { '.a': { records: 23 } } } },
			{ url: 'https://trezy.codes/blog/x', links: { 'app.bsky.feed.post': { '.a': { records: 12 } } } },
		]

		expect(getCollectionTotalMulti(perTarget, 'app.bsky.feed.post')).toBe(35)
	})

	it('counts targets where the collection is absent as 0', () => {
		const perTarget = [
			{ url: 'a', links: { 'app.bsky.feed.post': { '.a': { records: 4 } } } },
			{ url: 'b', links: {} },
		]

		expect(getCollectionTotalMulti(perTarget, 'app.bsky.feed.post')).toBe(4)
	})

	it('returns 0 for an empty target list', () => {
		expect(getCollectionTotalMulti([], 'app.bsky.feed.post')).toBe(0)
	})
})
