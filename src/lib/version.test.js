import { describe, it, expect } from 'vitest'
import { getVersionData } from './version.js'

// `getVersionData` reads real build-time state (this repo's `.git`,
// `node_modules/astro/package.json`, `bun.lock`) rather than mocked fixtures
// -- it's the same environment Astro's build will run in, so this is an
// integration check of the shape Task 26 can rely on, not a pure-logic unit
// test (that's `deps.test.js`).
describe('getVersionData', () => {
	it('returns the documented shape', async () => {
		const versionData = await getVersionData()

		expect(typeof versionData.builtAt).toBe('number')
		expect(versionData.builtAt).toBeLessThanOrEqual(Date.now())

		expect(versionData.git).toHaveProperty('branch')
		expect(versionData.git).toHaveProperty('hash')
		expect(versionData.git).toHaveProperty('shortHash')
		expect(versionData.git).toHaveProperty('message')
		expect(versionData.git).toHaveProperty('author')

		expect(versionData.environment.node).toBe(process.version.replace(/^v/u, ''))
		expect(versionData.environment.platform).toBe(process.platform)

		expect(Array.isArray(versionData.dependencies)).toBe(true)
	})

	it('reads git info from this repo via isomorphic-git (branch/hash/shortHash/message/author populated)', async () => {
		const { git: gitInfo } = await getVersionData()

		// This repo has a `.git` with commits, so isomorphic-git should resolve
		// real values rather than degrading to nulls.
		expect(typeof gitInfo.branch).toBe('string')
		expect(gitInfo.hash).toMatch(/^[0-9a-f]{40}$/u)
		expect(gitInfo.shortHash).toBe(gitInfo.hash.slice(0, 7))
		expect(typeof gitInfo.message).toBe('string')
		expect(typeof gitInfo.author).toBe('string')
	})

	it('reads the installed astro version from node_modules', async () => {
		const versionData = await getVersionData()
		expect(versionData.environment.astro).toMatch(/^\d+\.\d+\.\d+/u)
	})

	it('parses bun.lock into a flat { name, version } dependency list', async () => {
		const versionData = await getVersionData()

		expect(versionData.dependencies.length).toBeGreaterThan(0)

		const astroDependency = versionData.dependencies.find(dependency => dependency.name === 'astro')
		expect(astroDependency).toBeTruthy()
		expect(typeof astroDependency.version).toBe('string')
		expect(Object.keys(astroDependency).sort()).toEqual(['name', 'version'])
	})

	it('does not include any Vercel-specific fields', async () => {
		// Note: `bun.lock` legitimately contains a `@vercel/og` dependency, so
		// this checks the specific dropped fields rather than scanning the
		// whole serialized object for the substring "vercel".
		const versionData = await getVersionData()

		expect(versionData.environment).not.toHaveProperty('deploymentType')
		expect(versionData.environment).not.toHaveProperty('region')
		expect(versionData.environment).not.toHaveProperty('next')
		expect(versionData).not.toHaveProperty('repo')
		expect(versionData.git).not.toHaveProperty('username')
	})
})
