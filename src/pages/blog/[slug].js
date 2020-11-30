// Module imports
import {
	useEffect,
} from 'react'
import {
	isEmpty,
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import PropTypes from 'prop-types'





// Component imports
import {
	firebase,
	firestore,
} from 'helpers/firebase'
import { useArticles } from 'contexts/ArticlesContext'
import ArticleMeta from 'components/ArticleMeta'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import Responses from 'components/Responses'
import useArticleSelector from 'store/selectors/useArticleSelector'
import useClaimsSelector from 'store/selectors/useClaimsSelector'





function ArticlePage(props) {
	const { slug } = props
	const {
		addArticle,
		articlesBySlug,
		connectArticleBySlug,
		disconnectArticleBySlug,
	} = useArticles()
	const article = articlesBySlug[slug] || props.article

	useEffect(() => {
		if (!articlesBySlug[slug] && props.article) {
			const { Timestamp } = firebase.firestore
			const { article: ssrArticle } = props

			// Convert timestamps back to Firebase Timestamp objects
			ssrArticle.createdAt = Timestamp.fromMillis(ssrArticle.createdAt)
			ssrArticle.publishedAt = Timestamp.fromMillis(ssrArticle.publishedAt)
			ssrArticle.updatedAt = Timestamp.fromMillis(ssrArticle.updatedAt)

			addArticle(ssrArticle)
		}
	}, [])

	useEffect(() => {
		connectArticleBySlug(slug)

		return () => disconnectArticleBySlug(slug)
	}, [
		connectArticleBySlug,
		disconnectArticleBySlug,
	])

	return (
		<PageWrapper
			description={article?.synopsis}
			title={createTitleStringFromArticle(article)}>
			{!article && (
				<section className="block">
					Loading...
				</section>
			)}

			{Boolean(article) && (
				<>
					<article className="block">
						<ArticleMeta {...article} />

						<MarkdownRenderer children={article.body} />
					</article>

					<Responses articleID={article.id} />
				</>
			)}
		</PageWrapper>
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
