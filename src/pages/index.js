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





function Home() {
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

Home.getInitialProps = async () => {
	const firestore = getFirestore()

	await firestore.get({
		collection: 'articles',
		limit: ARTICLE_LIMIT,
		orderBy: ['publishedAt', 'desc'],
		where: ['isDraft', '==', false],
	})

	return {}
}





export default Home
