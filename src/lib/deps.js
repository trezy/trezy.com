// Pure parser for `bun.lock`, ported from `legacy/app/version/page.js`. Kept
// dependency-free (no `fs` reads here) so it's trivially unit-testable --
// `version.js` is responsible for reading the lockfile off disk and handing
// its text to `parseDependencies`.
//
// `bun.lock` is JSON with trailing commas (not valid JSON on its own), so
// legacy stripped them before `JSON.parse`. Each entry under `packages` is
// keyed by the bare package name and holds a tuple of
// `[nameAtVersion, resolvedPath, metadata, checksum]`; the version is
// whatever follows `<name>@` in `nameAtVersion`.

// Strips trailing commas before `}`/`]` so `bun.lock` parses as JSON.
function stripTrailingCommas(lockText) {
	return lockText.replace(/,(\s*[}\]])/g, '$1')
}

/**
 * @param {string} lockText - Raw contents of a `bun.lock` file.
 * @returns {Array<{ name: string, version: string, resolution: string, [key: string]: unknown }>}
 */
export function parseDependencies(lockText) {
	const lockfileData = JSON.parse(stripTrailingCommas(lockText))
	const packages = lockfileData.packages || {}

	return Object.entries(packages).map(([name, entry]) => {
		const [nameAtVersion, , metadata] = entry
		const version = nameAtVersion.slice(name.length + 1)

		return {
			name,
			version,
			resolution: nameAtVersion,
			...metadata,
		}
	})
}
