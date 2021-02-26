export function calculateReadtime(input) {
	const wordCount = input.replace(/\s+/g, ' ').split(' ').length
	return (wordCount / 200) * 60 * 1000
}
