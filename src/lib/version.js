// Build-time version data gathering, ported from `legacy/app/version/page.js`
// + `legacy/components/VersionPage/**`. This runs in Astro frontmatter (Node,
// build time only) -- there is no client-side equivalent, and Task 26 renders
// whatever `getVersionData()` returns into a page.
//
// Unlike legacy, git info is read with `isomorphic-git` directly against the
// repo's `.git` directory -- no `git` binary is spawned (no `child_process`,
// no `execSync`) and `git-rev-promises` (which itself shells out) is not
// used. All Vercel-specific fields from legacy (`VERCEL_ENV`,
// `VERCEL_REGION`, `VERCEL_GIT_*`, `deploymentType`, `region`, repo
// owner/slug/username) are dropped entirely -- this is a static build with no
// Vercel runtime.

// Module imports
import fs from 'node:fs'
import path from 'node:path'
import * as git from 'isomorphic-git'

// Local imports
import { parseDependencies } from './deps.js'

// Local constants
const NULL_GIT_INFO = {
	branch: null,
	hash: null,
	shortHash: null,
	message: null,
	author: null,
}

// Reads git branch/commit info via isomorphic-git (reads `.git` files
// directly, no `git` process spawned). Degrades to all-null if `dir` isn't a
// git repo (or has no commits yet) so a missing `.git` never crashes the
// build.
async function getGitInfo(dir) {
	try {
		const [branch, hash] = await Promise.all([
			git.currentBranch({ fs, dir, fullname: false }),
			git.resolveRef({ fs, dir, ref: 'HEAD' }),
		])

		const [{ commit }] = await git.log({ fs, dir, depth: 1 })

		return {
			branch: branch ?? null,
			hash,
			shortHash: hash.slice(0, 7),
			message: commit.message,
			author: commit.author.name,
		}
	} catch {
		return { ...NULL_GIT_INFO }
	}
}

// Reads the installed Astro version straight from its own `package.json`
// (replaces legacy's `next` version) rather than trusting the semver range
// in this project's `package.json`.
function getAstroVersion(dir) {
	try {
		const astroPackageJsonPath = path.resolve(dir, 'node_modules/astro/package.json')
		const astroPackageJson = JSON.parse(fs.readFileSync(astroPackageJsonPath, 'utf8'))
		return astroPackageJson.version ?? null
	} catch {
		return null
	}
}

// Reads and parses `bun.lock`, reduced to the `{ name, version }` shape
// `getVersionData` promises. Degrades to an empty array if the lockfile is
// missing or unparseable.
function getDependencies(dir) {
	try {
		const bunLockPath = path.resolve(dir, 'bun.lock')
		const lockText = fs.readFileSync(bunLockPath, 'utf8')

		return parseDependencies(lockText).map(({ name, version }) => ({ name, version }))
	} catch {
		return []
	}
}

/**
 * Gathers build-time version data: git info, environment (node/astro
 * version/platform), and parsed `bun.lock` dependencies. Stamped with
 * `builtAt = Date.now()` at call time.
 *
 * @returns {Promise<{
 *   builtAt: number,
 *   git: { branch: string|null, hash: string|null, shortHash: string|null, message: string|null, author: string|null },
 *   environment: { node: string, astro: string|null, platform: string },
 *   dependencies: Array<{ name: string, version: string }>,
 * }>}
 */
export async function getVersionData() {
	const dir = process.cwd()

	const [gitInfo, dependencies] = await Promise.all([
		getGitInfo(dir),
		getDependencies(dir),
	])

	return {
		builtAt: Date.now(),
		git: gitInfo,
		environment: {
			node: process.version.replace(/^v/u, ''),
			astro: getAstroVersion(dir),
			platform: process.platform,
		},
		dependencies,
	}
}
