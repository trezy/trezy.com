export function mdastNodeToString(node) {
	switch (node.type) {
		case 'paragraph':
			return node.children.map(mdastNodeToString).join('') + '\n'
		case 'text':
			return node.value
		default:
			if (node.children) {
				return node.children.map(mdastNodeToString).join('')
			} else if (node.value) {
				return node.value
			} else {
				return ''
			}
	}
}
