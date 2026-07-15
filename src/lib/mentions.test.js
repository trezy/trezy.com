import { describe, it, expect } from 'vitest'
import {
	COLLECTION_GROUPS,
	COLLECTION_META,
	SUPPORTED_COLLECTIONS,
	getGroupForCollection,
	getHighlightId,
} from './mentions.js'

describe('getHighlightId', () => {
	it('is deterministic for the same input', () => {
		const text = 'This is a highlighted passage.'
		expect(getHighlightId(text)).toBe(getHighlightId(text))
	})

	it('is stable for a known input', () => {
		// Locks in the exact hash algorithm ported from
		// legacy/components/ArticleMentions/api.js so the id scheme (and any
		// `#hl-<id>` deep links already shared) never silently changes.
		expect(getHighlightId('hello world')).toBe('hl-to5x38')
	})

	it('returns different ids for different text', () => {
		expect(getHighlightId('foo')).not.toBe(getHighlightId('bar'))
	})

	it('returns null for empty/falsy input', () => {
		expect(getHighlightId('')).toBe(null)
		expect(getHighlightId(null)).toBe(null)
		expect(getHighlightId(undefined)).toBe(null)
	})

	it('always begins with the hl- prefix and a base36 suffix', () => {
		expect(getHighlightId('another example string')).toMatch(/^hl-[0-9a-z]+$/)
	})
})

describe('SUPPORTED_COLLECTIONS', () => {
	it('lists all six supported atproto collections', () => {
		expect(SUPPORTED_COLLECTIONS).toEqual([
			'app.bsky.feed.post',
			'site.standard.document',
			'network.cosmik.card',
			'network.cosmik.connection',
			'at.margin.highlight',
			'at.margin.note',
		])
	})
})

describe('COLLECTION_GROUPS', () => {
	it('defines the four expected groups in order', () => {
		expect(COLLECTION_GROUPS.map(g => g.id)).toEqual(['bluesky', 'articles', 'semble', 'margin'])
	})
})

describe('getGroupForCollection', () => {
	it('maps a bluesky post to the bluesky group', () => {
		expect(getGroupForCollection('app.bsky.feed.post')).toBe('bluesky')
	})

	it('maps standard documents to the articles group', () => {
		expect(getGroupForCollection('site.standard.document')).toBe('articles')
	})

	it('maps both semble collections to the semble group', () => {
		expect(getGroupForCollection('network.cosmik.card')).toBe('semble')
		expect(getGroupForCollection('network.cosmik.connection')).toBe('semble')
	})

	it('maps both margin collections to the margin group', () => {
		expect(getGroupForCollection('at.margin.highlight')).toBe('margin')
		expect(getGroupForCollection('at.margin.note')).toBe('margin')
	})

	it('returns undefined/null for an unsupported collection', () => {
		expect(getGroupForCollection('not.a.real.collection')).toBeFalsy()
	})

	it('agrees with COLLECTION_META for every supported collection', () => {
		for (const collection of SUPPORTED_COLLECTIONS) {
			expect(getGroupForCollection(collection)).toBe(COLLECTION_META[collection].group)
		}
	})
})
