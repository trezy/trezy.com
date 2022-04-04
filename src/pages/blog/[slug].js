// Module imports
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { ArticleMeta } from 'components/ArticleMeta'
import { Block } from 'components/Block/index.js'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import * as Contentful from 'helpers/Contentful'





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
				headerImageHeight={article.headerImage?.fields.file.details.image.height}
				headerImageSource={article.headerImage?.fields.file.url.replace(/^\/\//, 'https://')}
				headerImageWidth={article.headerImage?.fields.file.details.image.width}>
				<h2>{article.title}</h2>

				<ArticleMeta article={article} />
			</Block>


			<Block elementType="article">
				<MarkdownRenderer children={article.body} />
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

	if (!article) {
		return { notFound: true }
	}

	return {
		props: { article },
	}
}
