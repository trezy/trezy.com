// Module imports
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { ArticleMeta } from 'components/ArticleMeta/index.js'
import { ArticleReactions } from 'components/ArticleReactions.js'
import { Block } from 'components/Block/index.js'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle.js'
import MarkdownRenderer from 'components/MarkdownRenderer.js'
import PageWrapper from 'components/PageWrapper.js'
import * as Contentful from 'helpers/Contentful.js'
import * as DevTo from 'helpers/DevTo.js'





export default function ArticlePage(props) {
	const { article } = props
	const Router = useRouter()

	if (Router.isFallback) {
    return (
			<div>{'Loading...'}</div>
		)
  }

	return (
		<PageWrapper
			description={article.synopsis}
			showHeader={false}
			title={createTitleStringFromArticle(article)}>
			<Block
				elementType="header"
				headerImageAlt={article.headerImage?.fields.description}
				headerImageSource={article.headerImage?.fields.file.url.replace(/^\/\//, 'https://')}>
				<h2>{article.title}</h2>

				<ArticleMeta article={article} />
			</Block>


			<Block elementType="article">
				<MarkdownRenderer children={article.body} />

				<ArticleReactions article={article} />
			</Block>
		</PageWrapper>
	)
}

ArticlePage.propTypes = {
	article: PropTypes.shape({}).isRequired,
}

export async function getStaticPaths() {
	const articles = await Contentful.getAllArticles()

	return {
		fallback: true,
		paths: articles.map(article => ({
			params: {
				slug: article.slug,
			},
		})),
	}
}

export async function getStaticProps(context) {
	const { slug } = context.params

	const article = await Contentful.getArticle(slug, context.preview)

	if (article.devToID) {
		const devToArticle = await DevTo.getArticle(article.devToID)

		article.devToReactions = devToArticle.positive_reactions_count
		article.devToURL = devToArticle.url
	}

	if (!article) {
		return { notFound: true }
	}

	return {
		props: { article },
	}
}
