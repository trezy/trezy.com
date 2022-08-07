// Module imports
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'





// Component imports
import { ArticleMeta } from '../../components/ArticleMeta/index.js'
import { ArticleReactions } from '../../components/ArticleReactions.js'
import { Block } from '../../components/Block/index.js'
import createTitleStringFromArticle from '../../helpers/createTitleStringFromArticle.js'
import { getArticleAsStaticProps } from '../../helpers/getArticleAsStaticProps.js'
import { getArticlesAsStaticPaths } from '../../helpers/getArticlesAsStaticPaths.js'
import { MDXRenderer } from '../../components/MDXRenderer.js'
import PageWrapper from '../../components/PageWrapper.js'





export default function ArticlePage(props) {
	const {
		article,
		changelog,
		dependencies,
		source,
	} = props
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
				elementType={'header'}
				headerImageAlt={article.headerImage?.fields.description}
				headerImageSource={article.headerImage?.fields.file.url.replace(/^\/\//, 'https://')}>
				<h2>{article.title}</h2>

				<ArticleMeta
					article={article}
					changelog={changelog}
					dependencies={dependencies} />
			</Block>

			<Block elementType={'article'}>
				<MDXRenderer source={source}/>

				<ArticleReactions article={article} />
			</Block>
		</PageWrapper>
	)
}

ArticlePage.defaultProps = {
	changelog: null,
	dependencies: null,
}

ArticlePage.propTypes = {
	article: PropTypes.shape({}).isRequired,
	changelog: PropTypes.string,
	dependencies: PropTypes.shape({
		dependencies: PropTypes.object,
		engines: PropTypes.object,
	}),
	source: PropTypes.any.isRequired,
}

export const getStaticPaths = getArticlesAsStaticPaths

export async function getStaticProps(context) {
	const { props: articleProps } = await getArticleAsStaticProps(context)

	if (!articleProps.article) {
		return { notFound: true }
	}

	return {
		props: { ...articleProps },
		revalidate: 600,
	}
}
