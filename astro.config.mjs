import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import directive from 'remark-directive'
import gfm from 'remark-gfm'
import squeezeParagraphs from 'remark-squeeze-paragraphs'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerRenderWhitespace,
  transformerMetaHighlight,
} from '@shikijs/transformers'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { remarkMermaid } from './src/lib/remark-mermaid.js'
import { remarkNormalizeHeadings } from './src/lib/remark-normalize-headings.js'

const SITE_URL = process.env.SITE_URL || 'https://trezy.codes'

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/atproto/callback') }), icon()],
  markdown: {
    // Mirrors legacy/helpers/getArticleAsStaticProps.js's `mdxOptions`.
    // Legacy ran these remark plugins through `next-mdx-remote`, which has no
    // built-in GFM support, so `remark-gfm` had to be explicit there. Astro's
    // own processor also applies GFM by default (`markdown.gfm: true`) — to
    // avoid running GFM twice we disable Astro's built-in and rely solely on
    // the explicit plugin below, matching legacy's single-pass behavior.
    gfm: false,
    // Legacy (next-mdx-remote) did NOT apply smartypants, so article bodies
    // rendered with straight quotes/apostrophes. Astro defaults smartypants on,
    // which rewrites them to curly (’ “ ”). That breaks the Margin marginalia
    // feature: `at.margin.highlight` records store the original straight-quote
    // `exact` text, and the inline highlighter matches rendered body text
    // against it verbatim — curly quotes make every apostrophe/quote mismatch,
    // so no highlight is ever found. Keep straight quotes to match legacy and
    // keep the highlight text contract intact.
    smartypants: false,
    remarkPlugins: [
      remarkNormalizeHeadings,
      gfm,
      directive,
      squeezeParagraphs,
      remarkMermaid,
    ],
    // Legacy used `rehype-pretty-code` (a rehype plugin wrapping Shiki) with
    // `theme: 'github-dark'` and this same transformer list, plus a custom
    // transformer that deleted `node.properties.style` on `<pre>` to drop the
    // inline background (`keepBackground: false`). Astro doesn't route
    // through rehype-pretty-code — it calls Shiki directly via
    // `markdown.shikiConfig`, which accepts the exact same `ShikiTransformer`
    // instances (these packages are highlighter-agnostic). So the transformer
    // list ports over unchanged; only the `keepBackground: false` behavior
    // needed re-implementing as one more transformer below, since Astro's
    // `ShikiConfig` has no `keepBackground` option of its own.
    shikiConfig: {
      theme: 'github-dark',
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerRenderWhitespace(),
        transformerMetaHighlight(),
        transformerColorizedBrackets(),
        {
          name: 'trezy-drop-pre-background',
          pre(node) {
            delete node.properties.style
          },
        },
      ],
    },
  },
  vite: {
    // atproto client-browser needs no special config; add here if build warns
  },
})
