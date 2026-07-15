// Mapping passed to `<Content components={mdxComponents} />` on the article
// detail page. Mirrors the `COMPONENTS` map in `legacy/components/
// MDXRenderer.js` (the authoritative source for which tag/component names
// need overrides): `a`/`ol`/`ul` overrides plus the custom `Codepen`,
// `DITAA`, `Notice`, and `Tweet` components used in article bodies. Legacy's
// `pre` override was a no-op passthrough (just re-spread props/children), so
// it isn't ported — Astro's own Shiki-rendered `<pre>` needs no wrapping.
// Legacy's `Directive` custom component (for `remark-directive` `:::`
// syntax) isn't ported either: no article body uses that syntax.
import Anchor from '@components/mdx/Anchor.astro'
import Codepen from '@components/mdx/Codepen.astro'
import DITAA from '@components/mdx/DITAA.astro'
import Notice from '@components/mdx/Notice.astro'
import OrderedList from '@components/mdx/OrderedList.astro'
import Tweet from '@components/mdx/Tweet.astro'
import UnorderedList from '@components/mdx/UnorderedList.astro'

export const mdxComponents = {
	Codepen,
	DITAA,
	Notice,
	Tweet,
	a: Anchor,
	ol: OrderedList,
	ul: UnorderedList,
}

export default mdxComponents
