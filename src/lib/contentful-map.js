// Maps a parsed Contentful article (shape: `fields` spread + `id`, `createdAt`,
// `updatedAt` — see `legacy/helpers/Contentful.js#parseArticle`) to the field
// names defined by the `blog` collection schema in `src/content.config.ts`.
//
// This function is intentionally pure/synchronous: it does NOT touch the
// network or filesystem. `headerImage` and any inline `images.ctfassets.net`
// URLs embedded in `body` are passed through unchanged here — the export
// script (`scripts/export-contentful.mjs`) is responsible for downloading
// those assets and rewriting `frontmatter.headerImage` / `body` to local
// relative paths *after* calling this function.
//
// `atUri`/`atCid` are deliberately never set — Sequoia manages those later
// via `bun run inject:atproto`.

function isEmpty(value) {
	if (value === null || value === undefined) {
		return true
	}

	if (typeof value === 'string' && value.length === 0) {
		return true
	}

	if (Array.isArray(value) && value.length === 0) {
		return true
	}

	return false
}

function stripEmpty(object) {
	const result = {}

	for (const [key, value] of Object.entries(object)) {
		if (!isEmpty(value)) {
			result[key] = value
		}
	}

	return result
}

export function mapArticleToFrontmatter(article) {
	const {
		slug,
		title,
		subtitle,
		synopsis,
		oldSlugs,
		isDraft,
		body = '',
		changelog,
		dependencies,
		devToID,
		devToURL,
		devToReactions,
		hashnodeSlug,
		hashnodeURL,
		hashnodeReactions,
		headerImage,
		// `createdAt` mirrors legacy `parseArticle`'s own fallback chain
		// (`legacyPublishedAt || legacyCreatedAt || sys.createdAt`), but we
		// re-derive it defensively here in case the caller hasn't already
		// computed it (e.g. this raw fixture in the unit test).
		createdAt,
		legacyPublishedAt,
		legacyCreatedAt,
		updatedAt,
		// `publishedAt` has no equivalent Contentful field today (it's a
		// forward-looking schema field) — mapped straight through if/when it
		// ever shows up on the parsed article.
		publishedAt,
	} = article

	const frontmatter = stripEmpty({
		title,
		subtitle,
		synopsis,
		oldSlugs,
		publishedAt,
		createdAt: createdAt || legacyPublishedAt || legacyCreatedAt,
		updatedAt,
		draft: Boolean(isDraft),
		changelog,
		dependencies,
		devToID,
		devToURL,
		devToReactions,
		hashnodeSlug,
		hashnodeURL,
		hashnodeReactions,
		headerImage,
	})

	return {
		frontmatter,
		body,
		slug,
	}
}

export default mapArticleToFrontmatter
