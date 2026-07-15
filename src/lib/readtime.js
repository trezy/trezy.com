// Ported from `legacy/helpers/calculateReadtime.js`. The legacy helper
// returned a millisecond duration (`(wordCount / 200) * 60 * 1000`, i.e. 200
// words-per-minute converted to ms) that `legacy/components/ArticleMeta`
// then converted back to whole minutes for display via
// `Math.round(readtime / 1000 / 60)`. This port collapses that round-trip:
// it divides by the same 200 words-per-minute rate and applies the same
// `Math.round`, but returns whole minutes directly.

export function calculateReadtime(input) {
	const wordCount = input.replace(/\s+/g, ' ').split(' ').length

	return Math.round(wordCount / 200)
}

export default calculateReadtime
