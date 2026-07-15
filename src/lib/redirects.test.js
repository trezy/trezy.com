import { describe, it, expect } from 'vitest'
import { buildRedirects } from './redirects.js'

describe('buildRedirects', () => {
	it('includes the static social redirect for /discord as a 302', () => {
		const output = buildRedirects([])
		expect(output).toContain('/discord\thttps://discord.gg/ZGeCAqAVac\t302')
	})

	it('includes the static legacy redirect for /code-of-conduct as a 301', () => {
		const output = buildRedirects([])
		expect(output).toContain('/code-of-conduct\t/legal/code-of-conduct\t301')
	})

	it('emits one /blog/<oldSlug> -> /blog/<slug> 301 line per oldSlug', () => {
		const output = buildRedirects([{ slug: 'a', oldSlugs: ['b', 'c'] }])

		expect(output).toContain('/blog/b\t/blog/a\t301')
		expect(output).toContain('/blog/c\t/blog/a\t301')
	})

	it('skips articles with no oldSlugs without erroring', () => {
		const output = buildRedirects([{ slug: 'a', oldSlugs: [] }, { slug: 'b' }])

		expect(output).not.toContain('undefined')
	})

	it('handles an empty articles array', () => {
		expect(() => buildRedirects([])).not.toThrow()
		expect(() => buildRedirects()).not.toThrow()
	})
})
