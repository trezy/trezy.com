// Build-time per-article Open Graph images.
//
// Route pattern is `/og/[slug].png`, so `astro-og-canvas`'s `getStaticPaths`
// derives the dynamic param name `slug` from the filename automatically (see
// `astro-og-canvas/dist/routing.js` -> `routePatternToParam`). Combined with
// the default `getSlug` (`pathToSlug`), a `pages` key of `entry.id` produces
// a route at exactly `/og/<entry.id>.png`, matching the path
// `src/pages/blog/[slug].astro` already requests via
// `image={`/og/${entry.id}.png`}`.
//
// Visual reference: `legacy/pages/api/og.js` (a `@vercel/og` React layout) —
// dark card (`#1a1a1a`), bold "Libre Franklin" title, secondary subtitle,
// brand-blue (`#0092c7`) accent, text anchored to the bottom, remote
// Contentful header image composited as a background with a dark gradient
// scrim.
//
// LIMITATION: `astro-og-canvas`'s `bgImage` option only accepts a local file
// path (it reads the file from disk with `fs.readFile` — see
// `astro-og-canvas/dist/assetLoaders.js`), so it cannot composite each
// article's remote Contentful header image as a background the way the
// legacy endpoint did. This approximates the legacy look instead with a dark
// gradient card, a brand-blue accent border, and the site's app icon as a
// small logo mark. The exact card design (including any header-image
// backdrop) is expected to be refined in the later "Impeccable" design pass;
// this task only needs a valid, unique-per-article PNG at the right path.
import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'

const entries = await getCollection('blog', ({ data }) => !data.draft)

// `OGImageRoute`'s `pages` keys become the route slug (via `getSlug`), so
// keying by `entry.id` is what makes the emitted file match `entry.id`.
const pages = Object.fromEntries(entries.map((entry) => [entry.id, entry.data]))

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,

	// The route's own filename (`[slug].png.ts`) already supplies the `.png`
	// extension, so the `pages` key (`entry.id`) is used as the slug verbatim.
	// Without this override, `astro-og-canvas`'s default `getSlug` also
	// appends `.png`, producing a broken double extension
	// (`/og/<id>.png.png`) instead of `/og/<id>.png`.
	getSlug: (id) => id,

	getImageOptions: (_id, data) => ({
		title: data.title,
		description: data.subtitle || data.synopsis || '',

		// Dark card approximating legacy's `DARK_BG` (`#1a1a1a`), with a subtle
		// brand-blue tint deepening toward the bottom (where title/description
		// land) instead of a flat solid fill.
		bgGradient: [
			[26, 26, 26],
			[13, 27, 34],
		],

		// Brand-blue (`#0092c7`) accent along the bottom edge, standing in for
		// the legacy card's brand-colored "trezy.codes" wordmark.
		border: {
			color: [0, 146, 199],
			width: 8,
			side: 'block-end',
		},

		// Small app-icon logo mark, top-start. `astro-og-canvas` decodes logo
		// images via CanvasKit, which needs a raster format (this repo's other
		// logos under `public/images/logos` are SVGs CanvasKit can't decode).
		logo: {
			path: './public/favicon/android-chrome-192x192.png',
			size: [56],
		},

		font: {
			title: {
				color: [255, 255, 255],
				size: 64,
				weight: 'Bold',
				families: ['Libre Franklin'],
			},
			description: {
				// Approximates legacy's `rgba(255, 255, 255, 0.7)` (RGBColor has no
				// alpha channel here) as a light gray.
				color: [191, 191, 199],
				size: 34,
				weight: 'Bold',
				families: ['Libre Franklin'],
			},
		},

		// Bold-only weight, matching legacy (which only ever loads weight 700).
		fonts: ['https://api.fontsource.org/v1/fonts/libre-franklin/latin-700-normal.ttf'],
	}),
})
