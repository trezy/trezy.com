// Module imports
import { cache } from 'react'
import behead from 'remark-behead'
import directive from 'remark-directive'
import gfm from 'remark-gfm'
import { serialize } from 'next-mdx-remote/serialize'
import rehypePrettyCode from 'rehype-pretty-code'
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
	transformerNotationFocus,
	transformerRenderWhitespace,
	transformerMetaHighlight,
} from '@shikijs/transformers'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import * as Contentful from './Contentful.js'
import * as StandardSite from './StandardSite.js'





// Constants
const mdxOptions = {
	remarkPlugins: [
		[behead, { depth: 1 }],
		gfm,
		directive,
		squeezeParagraphs,
	],
	rehypePlugins: [
		[rehypePrettyCode, {
			keepBackground: false,
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
					pre(node) {
						delete node.properties.style
					},
				},
			],
		}],
	],
}





export async function getArticleAsStaticProps(context) {
	const { slug } = context.params
	const props = {}

	const article = await Contentful.getArticle(slug, context.preview)

	if (article) {
		props.article = article

		const atprotoRef = await StandardSite.getArticleAtprotoRef(slug)
		if (atprotoRef) {
			article.atUri = atprotoRef.uri
			article.atCid = atprotoRef.cid
		}

		props.dependencies = article.dependencies || null

		props.source = await serialize(article.body, {
			mdxOptions,
			blockJS: false,
		})

		if (article.changelog) {
			props.changelog = await serialize(article.changelog, {
				mdxOptions,
				blockJS: false,
			})
		}
	}

	return { props }
}

export { mdxOptions }

export const getArticleData = cache(async function getArticleData(slug) {
	const result = {}

	const article = await Contentful.getArticle(slug)

	if (article) {
		result.article = article

		const atprotoRef = await StandardSite.getArticleAtprotoRef(slug)
		if (atprotoRef) {
			article.atUri = atprotoRef.uri
			article.atCid = atprotoRef.cid
		}

		result.dependencies = article.dependencies || null
		result.body = article.body

		if (article.changelog) {
			result.changelogBody = article.changelog
		}
	}

	return result
})
