import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { randomUUID } from 'crypto'

const FACET_TYPE_MAP = {
	strong: 'pub.leaflet.richtext.facet#bold',
	emphasis: 'pub.leaflet.richtext.facet#italic',
	delete: 'pub.leaflet.richtext.facet#strikethrough',
	inlineCode: 'pub.leaflet.richtext.facet#code',
}

function extractInlineContent(nodes) {
	let plaintext = ''
	const facets = []

	for (const node of nodes) {
		switch (node.type) {
			case 'text': {
				plaintext += node.value
				break
			}

			case 'inlineCode': {
				const byteStart = Buffer.byteLength(plaintext, 'utf8')
				plaintext += node.value
				const byteEnd = Buffer.byteLength(plaintext, 'utf8')
				facets.push({
					index: { byteStart, byteEnd },
					features: [{ $type: FACET_TYPE_MAP.inlineCode }],
				})
				break
			}

			case 'strong':
			case 'emphasis':
			case 'delete': {
				const byteStart = Buffer.byteLength(plaintext, 'utf8')
				const inner = extractInlineContent(node.children)
				plaintext += inner.plaintext
				const byteEnd = Buffer.byteLength(plaintext, 'utf8')
				facets.push({
					index: { byteStart, byteEnd },
					features: [{ $type: FACET_TYPE_MAP[node.type] }],
				})
				for (const innerFacet of inner.facets) {
					facets.push(innerFacet)
				}
				break
			}

			case 'link': {
				const byteStart = Buffer.byteLength(plaintext, 'utf8')
				const inner = extractInlineContent(node.children)
				plaintext += inner.plaintext
				const byteEnd = Buffer.byteLength(plaintext, 'utf8')
				facets.push({
					index: { byteStart, byteEnd },
					features: [{ $type: 'pub.leaflet.richtext.facet#link', uri: node.url }],
				})
				for (const innerFacet of inner.facets) {
					facets.push(innerFacet)
				}
				break
			}

			default: {
				if (node.children) {
					const inner = extractInlineContent(node.children)
					plaintext += inner.plaintext
					facets.push(...inner.facets)
				} else if (node.value) {
					plaintext += node.value
				}
				break
			}
		}
	}

	return { plaintext, facets }
}

function convertParagraph(node) {
	if (node.children.length === 1 && node.children[0].type === 'image') {
		return convertImage(node.children[0])
	}

	const { plaintext, facets } = extractInlineContent(node.children)
	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.text',
			plaintext,
			facets,
		},
	}
}

function convertHeading(node) {
	const { plaintext, facets } = extractInlineContent(node.children)
	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.header',
			level: node.depth,
			plaintext,
			facets,
		},
	}
}

function convertCode(node) {
	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.code',
			plaintext: node.value,
			...(node.lang ? { language: node.lang } : {}),
		},
	}
}

function convertBlockquote(node) {
	const parts = []
	for (const child of node.children) {
		if (child.type === 'paragraph') {
			parts.push(extractInlineContent(child.children))
		}
	}

	const plaintext = parts.map((p) => p.plaintext).join('\n')
	const facets = []
	let offset = 0
	for (const part of parts) {
		for (const facet of part.facets) {
			facets.push({
				index: {
					byteStart: facet.index.byteStart + offset,
					byteEnd: facet.index.byteEnd + offset,
				},
				features: facet.features,
			})
		}
		offset += Buffer.byteLength(part.plaintext, 'utf8') + 1
	}

	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.blockquote',
			plaintext,
			facets,
		},
	}
}

function convertThematicBreak() {
	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.horizontalRule',
		},
	}
}

function convertImage(node) {
	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.image',
			__placeholder: true,
			__src: node.url,
			__alt: node.alt || undefined,
		},
	}
}

function convertListItem(item) {
	let content = { $type: 'pub.leaflet.blocks.text', plaintext: '', facets: [] }
	const nestedChildren = []

	for (const child of item.children) {
		if (child.type === 'paragraph' && content.plaintext === '') {
			const extracted = extractInlineContent(child.children)
			content = {
				$type: 'pub.leaflet.blocks.text',
				plaintext: extracted.plaintext,
				facets: extracted.facets,
			}
		} else if (child.type === 'list') {
			for (const nestedItem of child.children) {
				nestedChildren.push(convertListItem(nestedItem))
			}
		}
	}

	return {
		content,
		children: nestedChildren,
	}
}

function convertList(node) {
	const isOrdered = node.ordered
	const blockType = isOrdered
		? 'pub.leaflet.blocks.orderedList'
		: 'pub.leaflet.blocks.unorderedList'

	const children = node.children.map((item) => {
		const converted = convertListItem(item)
		return {
			$type: `${blockType}#listItem`,
			content: converted.content,
			children: converted.children,
		}
	})

	const block = {
		$type: blockType,
		children,
	}

	if (isOrdered && node.start != null && node.start !== 1) {
		block.startIndex = node.start
	}

	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block,
	}
}

function convertTable(node) {
	const rows = []
	for (const row of node.children) {
		const cells = row.children.map((cell) => {
			const { plaintext } = extractInlineContent(cell.children)
			return plaintext
		})
		rows.push(cells.join(' | '))
	}

	return {
		$type: 'pub.leaflet.pages.linearDocument#block',
		block: {
			$type: 'pub.leaflet.blocks.text',
			plaintext: rows.join('\n'),
			facets: [],
		},
	}
}

export function markdownToLeaflet(markdown) {
	const tree = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.parse(markdown)

	const blocks = []
	const imagePlaceholders = []

	for (const node of tree.children) {
		let block

		switch (node.type) {
			case 'paragraph':
				block = convertParagraph(node)
				break
			case 'heading':
				block = convertHeading(node)
				break
			case 'code':
				block = convertCode(node)
				break
			case 'blockquote':
				block = convertBlockquote(node)
				break
			case 'list':
				block = convertList(node)
				break
			case 'thematicBreak':
				block = convertThematicBreak()
				break
			case 'table':
				block = convertTable(node)
				break
			case 'image':
				block = convertImage(node)
				break
			case 'html':
				continue
			default:
				continue
		}

		if (block?.block?.__placeholder) {
			imagePlaceholders.push({
				blockIndex: blocks.length,
				src: block.block.__src,
				alt: block.block.__alt,
			})
		}

		blocks.push(block)
	}

	const content = {
		$type: 'pub.leaflet.content',
		pages: [
			{
				id: randomUUID(),
				$type: 'pub.leaflet.pages.linearDocument',
				blocks,
			},
		],
	}

	return { content, imagePlaceholders }
}
