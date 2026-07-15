// Turns fenced ```mermaid code blocks into a raw `<pre class="mermaid">`
// HTML node so Shiki never attempts to syntax-highlight the diagram source
// (mermaid's grammar isn't a language Shiki understands, and highlighting it
// would just mangle the source `mermaid.run()` needs later).
//
// The companion client island (`src/components/islands/mermaid.js`) finds
// `.mermaid` elements at runtime and calls `mermaid.run()` on them. That
// island is intentionally NOT imported anywhere yet — the article layout
// wires it up in Task 16.
//
// No new dependency was added for tree traversal (skipping `unist-util-visit`,
// which isn't a direct dependency of this project) — the walk below is a
// handful of lines and the mdast tree is shallow enough that a manual
// recursive visit is simplest.

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

function visit(node, callback) {
	callback(node)

	if (Array.isArray(node.children)) {
		node.children.forEach((child) => visit(child, callback))
	}
}

export function remarkMermaid() {
	return function transformer(tree) {
		visit(tree, (node) => {
			if (node.type !== 'code' || node.lang !== 'mermaid') {
				return
			}

			// Replace the `code` node with a raw `html` node. mdast-util-to-hast
			// (used by Astro's markdown + MDX pipelines) passes `html`-type nodes
			// through verbatim when `allowDangerousHtml` is set, which is how
			// Astro already supports raw HTML embedded in `.md` files.
			node.type = 'html'
			node.value = `<pre class="mermaid">${escapeHtml(node.value)}</pre>`
		})
	}
}

export default remarkMermaid
