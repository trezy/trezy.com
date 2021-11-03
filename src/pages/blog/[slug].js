// Module imports
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { ArticleMeta } from 'components/ArticleMeta'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import * as Contentful from 'helpers/Contentful'





function ArticlePage(props) {
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
			<header className="block no-top-margin">
				<h2>{article.title}</h2>

				<ArticleMeta article={article} />
			</header>

			<article className="block">
				<MarkdownRenderer children={article.body} />
			</article>
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

	const article = await Contentful.getArticle(slug)

	if (!article) {
		return { notFound: true }
	}

	return {
		props: { article },
	}
}

export default ArticlePage
