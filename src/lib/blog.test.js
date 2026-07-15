import { describe, it, expect } from 'vitest'
import { articleTitle, getArticleURL, sortArticles } from './blog.js'

describe('articleTitle', () => {
	it('joins title and subtitle with " - "', () => {
		const entry = { data: { title: 'Hello', subtitle: 'World' } }
		expect(articleTitle(entry)).toBe('Hello - World')
	})

	it('returns just the title when there is no subtitle', () => {
		const entry = { data: { title: 'Hello' } }
		expect(articleTitle(entry)).toBe('Hello')
	})

	it('returns an empty string when there is no entry', () => {
		expect(articleTitle(undefined)).toBe('')
	})
})

describe('getArticleURL', () => {
	it('builds a /blog/<id> URL from the entry id', () => {
		const entry = { id: 'my-cool-post', data: {} }
		expect(getArticleURL(entry)).toBe('/blog/my-cool-post')
	})
})

describe('sortArticles', () => {
	it('sorts entries by publishedAt (falling back to createdAt) descending', () => {
		const oldest = { id: 'oldest', data: { createdAt: new Date('2020-01-01') } }
		const middle = { id: 'middle', data: { publishedAt: new Date('2021-06-01'), createdAt: new Date('2020-06-01') } }
		const newest = { id: 'newest', data: { createdAt: new Date('2022-01-01') } }

		const sorted = sortArticles([oldest, newest, middle])

		expect(sorted.map(entry => entry.id)).toEqual(['newest', 'middle', 'oldest'])
	})

	it('does not mutate the input array', () => {
		const a = { id: 'a', data: { createdAt: new Date('2020-01-01') } }
		const b = { id: 'b', data: { createdAt: new Date('2021-01-01') } }
		const input = [a, b]

		sortArticles(input)

		expect(input).toEqual([a, b])
	})
})
