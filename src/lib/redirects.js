// Pure builder for the wisp `_redirects` file.
//
// Ports the STATIC redirect rules from the original Next.js `next.config.js`
// `redirects()` function (socials + legacy URL rules), then appends one
// `/blog/<oldSlug>` -> `/blog/<slug>` (301) line per `oldSlugs` entry per
// article.
//
// KNOWN LIMITATION: the legacy `redirects()` also redirected
// `/blog/<contentful-sys-id>` -> `/blog/<slug>` for every article (the
// Contentful entry's internal `sys.id`). Those Contentful entry IDs were NOT
// retained in the exported MDX frontmatter (see `src/content.config.ts` /
// `scripts/export-contentful.mjs`), so there is no way to reproduce that
// rule set here. Old `/blog/<contentful-id>` URLs will NOT redirect after
// this migration; `oldSlugs`-based URLs (the human-readable slug history)
// still will.

const STATIC_RULES = [
	// Socials (temporary/302 — mirrors `permanent: false` in next.config.js)
	{ from: '/github', to: 'https://github.com/trezy', status: 302 },
	{ from: '/imdb', to: 'https://imdb.com/name/nm5442490', status: 302 },
	{ from: '/instagram', to: 'https://instagram.com/TrezyCodes', status: 302 },
	{ from: '/twitter', to: 'https://twitter.com/TrezyCodes', status: 302 },
	{ from: '/youtube', to: 'https://youtube.com/TrezyCodes1', status: 302 },

	// Legacy URLs (permanent/301)
	{ from: '/privacy-policy', to: '/legal/privacy-policy', status: 301 },
	{ from: '/terms-of-service', to: '/legal/terms-of-service', status: 301 },

	// Retired pages. The cookie policy folded into the privacy policy (analytics
	// cookies are the only ones the site sets), and the site-facing code of
	// conduct went with the community spaces it governed. The repo's
	// contributor-facing CODE_OF_CONDUCT.md is the one that still applies.
	// Both the bare paths and their /legal/ counterparts were indexed, so all
	// four need somewhere to land.
	{ from: '/cookie-policy', to: '/legal/privacy-policy', status: 301 },
	{ from: '/legal/cookie-policy', to: '/legal/privacy-policy', status: 301 },
	{ from: '/code-of-conduct', to: '/legal', status: 301 },
	{ from: '/legal/code-of-conduct', to: '/legal', status: 301 },
	{ from: '/index', to: '/', status: 301 },
	{ from: '/mozy', to: '/', status: 301 },
]

function ruleLine({ from, to, status }) {
	return `${from}\t${to}\t${status}`
}

export function buildRedirects(articles = []) {
	const lines = STATIC_RULES.map(ruleLine)

	for (const article of articles ?? []) {
		const { slug, oldSlugs } = article ?? {}

		if (!slug || !oldSlugs?.length) {
			continue
		}

		for (const oldSlug of oldSlugs) {
			lines.push(ruleLine({ from: `/blog/${oldSlug}`, to: `/blog/${slug}`, status: 301 }))
		}
	}

	return `${lines.join('\n')}\n`
}
