// Module imports
import { useEffect } from 'react'





// Component imports
import { useArticlesContext } from 'contexts/ArticlesContext'
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'





function Blog(props) {
	const { articles } = props
	const {
		articlesByID,
		useArticles,
	} = useArticlesContext()

	useArticles({ preloadedArticles: articles })

	return (
		<PageWrapper
			description="New ideas, old ideas, and regular ideas can all be found below the titles of Trezy's titular technological tidings."
			title="Blog">
			<ArticleList articles={articles} />
		</PageWrapper>
	)
}

export async function getServerSideProps(context) {
	const { firestore } = await import('helpers/firebase')
	const articles = []
	const articlesSnapshot = await firestore
		.collection('articles')
		.where('isDraft', '==', false)
		.orderBy('publishedAt', 'desc')
		.get()

	articlesSnapshot.forEach(doc => {
		const article = doc.data()
		article.createdAt = article.createdAt.toMillis()
		article.publishedAt = article.publishedAt.toMillis()
		article.updatedAt = article.updatedAt.toMillis()
		articles.push(article)
	})

	return {
		props: {
			articles,
		},
	}
}





export default Blog
