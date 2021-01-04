// Module imports
import { deflate } from 'pako'





export function encodeDiagram(string) {
	const compressedString = deflate(string, { level: 9, to: 'string' })
	const base64String = btoa(String.fromCharCode.apply(null, compressedString))

	return base64String
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}
