// Module imports
import { getFirestore } from 'redux-firestore'
import Link from 'next/link'
import React from 'react'





// Component imports
import ArticleList from 'components/ArticleList'
import ClientList from 'components/ClientList'
import PageWrapper from 'components/PageWrapper'





// Local constants
const ARTICLE_LIMIT = 3





function Home(props) {
	const { articles } = props

	return (
		<PageWrapper
			description="Software engineer. UX designer. Accessibility expert. The web should be available to everyone, so Trezy uses JavaScript, React, and CSS to accomplish that goal."
			showHeader={false}
			title="Home">
			<header className="block hero">
				<h2>&lt;trezy-who/&gt;</h2>

				<p>Software engineer, UX designer, and <a href="https://a11yproject.com">#a11y</a>.</p>
			</header>

			<section className="block">
				<header>
					<h2>Latest articles</h2>
				</header>

				<ArticleList
					articles={articles}
					className="latest-articles"
					includeStyles={false}
					limit={ARTICLE_LIMIT} />

				<Link href="/blog">
					<a>See more</a>
				</Link>
			</section>

			<section className="block center">
				<p>As a software consultant, I've been lucky to work with some of the best teams from well-known brands on products that make the world a better place.</p>

				<ClientList />
			</section>
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
		.limit(ARTICLE_LIMIT)
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





export default Home
