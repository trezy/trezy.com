// Renders `<pre class="mermaid">` blocks produced by `src/lib/remark-mermaid.js`
// (the ```mermaid fenced code blocks in blog articles). This module is a plain
// side-effecting script, not a custom element — there's nothing per-instance
// to encapsulate, `mermaid.run()` just needs to find every `.mermaid` block on
// the page once it's ready.
//
// Not imported anywhere yet. The article layout added in Task 16 is
// responsible for loading this (e.g. `<script src={...}>` or a bare
// `import` in a `<script>` tag) on pages that render article bodies.

// Mermaid is lazy-loaded: only import the heavy bundle when a .mermaid
// element is actually present on the page. This avoids downloading ~257KB
// (mermaid core + katex) on pages that don't use diagrams.
async function renderMermaid() {
  if (!document.querySelector('.mermaid')) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false })
  await mermaid.run({ querySelector: '.mermaid' })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMermaid, { once: true })
} else {
  renderMermaid()
}
