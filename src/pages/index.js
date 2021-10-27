// Module imports
import { createClient as createContentfulClient } from 'contentful'
import Link from 'next/link'
import React from 'react'





// Component imports
import { calculateReadtime } from 'helpers/calculateReadtime'
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

export async function getStaticProps() {
	const contentfulClient = createContentfulClient({
		space: process.env.CONTENTFUL_API_SPACE_ID,
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
	})

	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
		})

	return {
		props: {
			articles: contentfulResponse.items.map(item => {
				return {
					...item.fields,
					createdAt: item.fields.legacyPublishedAt || item.fields.legacyCreatedAt || item.sys.createdAt,
					readtime: calculateReadtime(item.fields.body),
					updatedAt: item.sys.updatedAt,
				}
			}),
		},
		revalidate:
			1 /* hours */ *
			60 /* minutes */ *
			60 /* seconds */ *
			1000 /* milliseconds */,
	}
}

export default Home
