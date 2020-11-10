// Module imports
import { getFirestore } from 'redux-firestore'
import React from 'react'





// Component imports
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'





function Blog() {
	return (
		<PageWrapper
			description="New ideas, old ideas, and regular ideas can all be found below the titles of Trezy's titular technological tidings."
			title="Blog">
			<ArticleList />
		</PageWrapper>
	)
}

Blog.getInitialProps = async () => {
	const firestore = getFirestore()

	await firestore.get({
		collection: 'articles',
		where: ['isDraft', '==', false],
		orderBy: ['publishedAt', 'desc'],
	})

	return {}
}





export default Blog
