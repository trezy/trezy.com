#!/usr/bin/env bun
// Generates the wisp `_redirects` file and writes it to `dist/_redirects`.
//
// Must run AFTER `astro build` (it writes into `dist/`, which `astro build`
// wipes/regenerates), so it is a separate step: `bun run build && bun run
// scripts/gen-redirects.mjs`.
//
// Reads every `src/content/blog/*.{md,mdx}` file's frontmatter directly
// (rather than importing `astro:content`, which is only resolvable inside
// Astro's own build/dev runtime) to get `{ slug, oldSlugs }` per article,
// where `slug` is the filename (sans extension) — matching the content
// collection's `id`, per `src/content.config.ts`.

import { glob } from 'node:fs/promises'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parse as parseYAML } from 'yaml'

import { buildRedirects } from '../src/lib/redirects.js'

const REPO_ROOT = new URL('..', import.meta.url).pathname
const CONTENT_DIR = path.join(REPO_ROOT, 'src/content/blog')
const DIST_DIR = path.join(REPO_ROOT, 'dist')
const OUTPUT_PATH = path.join(DIST_DIR, '_redirects')

function extractFrontmatter(raw) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)

	if (!match) {
		return {}
	}

	try {
		return parseYAML(match[1]) ?? {}
	} catch (error) {
		console.warn(`[gen-redirects] failed to parse frontmatter: ${error.message}`)
		return {}
	}
}

async function getArticles() {
	const articles = []

	let filenames

	try {
		filenames = await Array.fromAsync(glob('**/*.{md,mdx}', { cwd: CONTENT_DIR }))
	} catch (error) {
		console.warn(`[gen-redirects] could not read ${CONTENT_DIR}: ${error.message}`)
		return articles
	}

	for (const filename of filenames) {
		const filePath = path.join(CONTENT_DIR, filename)
		const slug = filename.replace(/\.(md|mdx)$/, '')

		let raw

		try {
			raw = await readFile(filePath, 'utf8')
		} catch (error) {
			console.warn(`[gen-redirects] skipping ${filename}: ${error.message}`)
			continue
		}

		const frontmatter = extractFrontmatter(raw)

		// Skip draft articles (matching blog page generation logic)
		if (frontmatter.draft === true) {
			continue
		}

		articles.push({
			slug,
			oldSlugs: Array.isArray(frontmatter.oldSlugs) ? frontmatter.oldSlugs : [],
		})
	}

	return articles
}

async function main() {
	const articles = await getArticles()
	const output = buildRedirects(articles)

	await mkdir(DIST_DIR, { recursive: true })
	await writeFile(OUTPUT_PATH, output, 'utf8')

	const oldSlugRuleCount = articles.reduce((sum, article) => sum + (article.oldSlugs?.length ?? 0), 0)

	console.log(`[gen-redirects] wrote ${OUTPUT_PATH}`)
	console.log(`[gen-redirects] ${articles.length} articles scanned, ${oldSlugRuleCount} oldSlug redirect rule(s) emitted`)
}

await main()
