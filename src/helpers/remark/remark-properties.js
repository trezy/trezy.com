// Module imports
import visitWithParents from 'unist-util-visit-parents'





const properties = () => {
	/* eslint-disable no-param-reassign */
	const visitor = (node, parents) => {
		if (!node.value) {
			return node
		}

		const matchData = /^\{(.+)\}/gu.exec(node.value)

		if (matchData) {
			const {
				index: matchIndex,
			} = matchData
			const [match, propertiesString] = matchData

			const parent = parents[parents.length - 1]
			const childIndex = parent.children.findIndex(child => child === node)
			const targetNode = parent.children[childIndex - 1]

			// Delete node if it only contains properties, otherwise remove the
			// properties string from the node.
			if (match.trim() === matchData.input.trim()) {
				parent.children = parent.children.filter(childNode => childNode !== node)
			} else {
				node.value = node.value.substring(matchIndex + match.length)
			}

			const props = propertiesString
				.replace(/".*?"/gu, match => match.replace(/\s/gu, '\\s'))
				.split(' ')
				.reduce((accumulator, prop) => {
					let [key, value] = prop
						.replace(/\\s/gu, ' ')
						.replace(/"/gu, '')
						.split('=')

					if (key.startsWith('.')) {
						accumulator.className = (accumulator.className || '') + key.replace(/^\./u, '')
					} else if (key.startsWith('#')) {
						accumulator.className = (accumulator.className || '') + key.replace(/^\./u, '')
					} else {
						if (value === 'true') {
							value = true
						} else if (value === 'false') {
							value = false
						} else if (typeof value === 'undefined') {
							value = true
						}

						accumulator[key] = value
					}

					return accumulator
				}, {})

			targetNode.data = props

			return [visitWithParents.SKIP, childIndex]
		}
	}
	/* eslint-enable no-param-reassign */

	const transformer = tree => {
		visitWithParents(tree, 'text', visitor)
	}

	return transformer
}





export { properties }
