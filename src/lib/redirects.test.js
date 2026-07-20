import { describe, it, expect } from 'vitest'
import { buildRedirects } from './redirects.js'

describe('buildRedirects', () => {
	it('includes a static social redirect as a 302', () => {
		const output = buildRedirects([])
		expect(output).toContain('/github\thttps://github.com/trezy\t302')
	})

	it('includes the static legacy redirect for /privacy-policy as a 301', () => {
		const output = buildRedirects([])
		expect(output).toContain('/privacy-policy\t/legal/privacy-policy\t301')
	})

	// The cookie policy and code of conduct pages were retired; their old URLs
	// (bare and /legal/-prefixed) were indexed, so all four still have to land
	// somewhere rather than 404.
	it('lands every retired legal URL somewhere', () => {
		const output = buildRedirects([])

		expect(output).toContain('/cookie-policy\t/legal/privacy-policy\t301')
		expect(output).toContain('/legal/cookie-policy\t/legal/privacy-policy\t301')
		expect(output).toContain('/code-of-conduct\t/legal\t301')
		expect(output).toContain('/legal/code-of-conduct\t/legal\t301')
	})

	it('no longer advertises the retired Discord server', () => {
		expect(buildRedirects([])).not.toContain('discord')
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
