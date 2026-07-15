// Module imports
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'





// Local imports
// (none — schema mirrors legacy/models/article.js + legacy/helpers/Contentful.js field names)





// NOTE: there is deliberately no `slug` field. The entry `id` (derived from
// the filename under `src/content/blog/`) IS the slug — this matches the
// legacy Contentful `fields.slug` behavior once files are named by slug.
const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		synopsis: z.string().optional(),
		oldSlugs: z.array(z.string()).default([]),
		publishedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		changelog: z.string().optional(),
		dependencies: z.any().optional(),
		devToID: z.string().optional(),
		devToURL: z.string().optional(),
		devToReactions: z.number().optional(),
		hashnodeSlug: z.string().optional(),
		hashnodeURL: z.string().optional(),
		hashnodeReactions: z.number().optional(),
		headerImage: z.union([
			image(),
			z.object({
				src: image(),
				alt: z.string().optional(),
			}),
		]).optional(),
		atUri: z.string().optional(),
		atCid: z.string().optional(),
	}),
})

export const collections = { blog }
