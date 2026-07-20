import { visit } from 'unist-util-visit'

// Per-document heading normalization.
//
// Each article page renders its title as the single <h1>. The MDX body should
// therefore start at <h2> and nest downward with no level skips. Authors are
// inconsistent about their top level, though — most start a section with `##`,
// but a couple of posts use `#`. A fixed `remark-behead` shift can't reconcile
// that: the shift that keeps `#`-authored posts out of a second <h1> pushes
// `##`-authored posts down to <h3>, skipping <h2> under the title.
//
// This plugin instead measures each document's shallowest heading and shifts
// every heading so that shallowest level lands on <h2>, preserving relative
// structure. Result: every article body starts at <h2> (never <h1>, so no
// collision with the title), with no skipped levels.
export function remarkNormalizeHeadings() {
  return (tree) => {
    let min = Infinity

    visit(tree, 'heading', (node) => {
      if (node.depth < min) min = node.depth
    })

    if (!Number.isFinite(min)) return

    const shift = 2 - min
    if (shift === 0) return

    visit(tree, 'heading', (node) => {
      node.depth = Math.min(6, Math.max(2, node.depth + shift))
    })
  }
}
