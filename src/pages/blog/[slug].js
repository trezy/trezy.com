// Module imports
import { useEffect } from 'react'
import PropTypes from 'prop-types'





// Component imports
import {
	firebase,
	firestore,
} from 'helpers/firebase'
import { Article } from 'components/Article'
import { ArticleContextProvider } from 'contexts/ArticleContext'
import { ArticleMeta } from 'components/ArticleMeta'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import Responses from 'components/Responses'





function ArticlePage(props) {
	const { slug } = props
	const article = props.article

	return (
		<ArticleContextProvider
			article={article}
			slug={slug}>
			<PageWrapper
				description={article?.synopsis}
				showHeader={false}
				title={createTitleStringFromArticle(article)}>
				{!article && (
					<section className="block">
						Loading...
					</section>
				)}

				{Boolean(article) && (
					<>
						<header className="block no-top-margin">
							<h2>{article.title}</h2>

							<ArticleMeta />
						</header>

						<Article />
					</>
				)}
			</PageWrapper>
		</ArticleContextProvider>
	)
}

ArticlePage.propTypes = {
	slug: PropTypes.string.isRequired,
}

export async function getServerSideProps(context) {
	const { slug } = context.params
	let article = null

	const articleSnapshot = await firestore
		.collection('articles')
		.where('isDraft', '==', false)
		.where('slug', '==', slug)
		.get()

	articleSnapshot.forEach(doc => {
		article = doc.data()
		article.createdAt = article.createdAt.toMillis()
		article.publishedAt = article.publishedAt.toMillis()
		article.updatedAt = article.updatedAt.toMillis()
	})

	if (!article) {
		return { notFound: true }
	}

	return {
		props: {
			article,
			slug,
		},
	}
}

export default ArticlePage
