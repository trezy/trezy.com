// Ported from `legacy/helpers/encodeDiagram.js`, which fed diagram source
// into `pako.deflate(string, { level: 9, to: 'string' })` and then either
// base64'd it with `Buffer` (a `typeof window === 'undefined'` branch) or
// `btoa` (browser branch). That component (`legacy/helpers/markdownRenderers
// /Kroki.js`) was marked `'use client'`, so in practice it only ever ran in
// the browser — the `Buffer` branch was dead code, and (since `pako.deflate`
// with `to: 'string'` returns a plain JS string, which has no `.buffer`
// property) broken dead code at that.
//
// This site renders MDX at build time in Node, so this port implements the
// path that was never actually exercised, using Kroki's documented encoding
// scheme directly: raw zlib deflate (pako's default Uint8Array output, not
// the `to: 'string'` mode) -> base64 -> URL-safe alphabet substitution.
// This is the same scheme https://kroki.io's own docs describe and produces
// URLs Kroki can decode, matching the legacy browser-side behavior's actual
// output shape.
import { deflate } from 'pako'

export function encodeDiagram(string) {
	const compressed = deflate(string, { level: 9 })
	const base64String = Buffer.from(compressed).toString('base64')

	return base64String
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}
