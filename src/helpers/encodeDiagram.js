// Module imports
import { deflate } from 'pako'





export function encodeDiagram(string) {
	const compressedString = deflate(string, { level: 9, to: 'string' })
	let base64String = null

	if (typeof window === 'undefined') {
		base64String = Buffer.from(compressedString.buffer).toString('base64')
	} else {
		base64String = btoa(String.fromCharCode.apply(null, compressedString))
	}

	return base64String
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}
