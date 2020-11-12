// Module imports
import {
	 html,
	 text,
} from 'mdast-builder'
import emojiRegex from 'emoji-regex'
import emojiToName from 'gemoji/emoji-to-name.json'
import visitWithParents from 'unist-util-visit-parents'





const a11yEmoji = () => {
	/* eslint-disable no-param-reassign */
	const visitor = (node, parents) => {
		if (!node?.value || (node.type !== 'text') || !emojiRegex().test(node.value)) {
			return node
		}
		const parent = parents[parents.length - 1]
		const childIndex = parent.children.findIndex(child => child === node)

		const emojiMatches = [...node.value.matchAll(emojiRegex())]
		const emojiSplit = node.value.split(emojiRegex())

		parent.children = emojiSplit.reduce((accumulator, string, index) => {
			accumulator.push(text(string))

			if (emojiMatches.length) {
				const emoji = emojiMatches.shift()[0]
				const emojiDescription = emojiToName[emoji] || ''

				accumulator.push(html(`<span aria-label="${emojiDescription}" role="img">${emoji}</span>`))
			}

			return accumulator
		}, [])
		return [visitWithParents.SKIP, childIndex + 1]
	}
	/* eslint-enable no-param-reassign */

	const transformer = tree => visitWithParents(tree, visitor)

	return transformer
}





export { a11yEmoji }
