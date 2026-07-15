import { describe, it, expect } from 'vitest'
import { parseDependencies } from './deps.js'

// A small bun.lock-shaped fixture. Deliberately includes a trailing comma in
// the `packages` object (bun.lock is JSON-with-trailing-commas, which is why
// legacy stripped them with `.replace(/,(\s*[}\]])/g, '$1')` before
// `JSON.parse`), a scoped package name, and a plain package name so both
// slicing paths (`name.length + 1`) are exercised.
const FIXTURE_LOCKFILE = `{
	"lockfileVersion": 1,
	"packages": {
		"lodash": ["lodash@4.17.21", "", {}, "sha512-abc"],

		"@antfu/utils": ["@antfu/utils@8.1.1", "", { "dependencies": { "foo": "^1.0.0" } }, "sha512-def"],
	},
}`

describe('parseDependencies', () => {
	it('extracts name and version for a plain package', () => {
		const dependencies = parseDependencies(FIXTURE_LOCKFILE)
		const lodash = dependencies.find(dependency => dependency.name === 'lodash')

		expect(lodash).toBeTruthy()
		expect(lodash.name).toBe('lodash')
		expect(lodash.version).toBe('4.17.21')
	})

	it('extracts name and version for a scoped package', () => {
		const dependencies = parseDependencies(FIXTURE_LOCKFILE)
		const antfuUtils = dependencies.find(dependency => dependency.name === '@antfu/utils')

		expect(antfuUtils).toBeTruthy()
		expect(antfuUtils.name).toBe('@antfu/utils')
		expect(antfuUtils.version).toBe('8.1.1')
	})

	it('carries the resolution string and any extra package metadata', () => {
		const dependencies = parseDependencies(FIXTURE_LOCKFILE)
		const antfuUtils = dependencies.find(dependency => dependency.name === '@antfu/utils')

		expect(antfuUtils.resolution).toBe('@antfu/utils@8.1.1')
		expect(antfuUtils.dependencies).toEqual({ foo: '^1.0.0' })
	})

	it('returns an empty array when the lockfile has no packages', () => {
		expect(parseDependencies('{ "lockfileVersion": 1 }')).toEqual([])
	})
})
