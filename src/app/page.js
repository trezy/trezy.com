// Module imports
import Link from 'next/link'

// Local imports
import { ClientList } from 'components/ClientList'
import { Container } from 'components/Container/Container'
import ArticleList from 'components/ArticleList'
import { PageContent } from 'components/PageContent.js'
import * as Contentful from 'helpers/Contentful'

// Local constants
const ARTICLE_LIMIT = 3

export const metadata = {
	title: 'Home',
	description: 'Software engineer. UX designer. Accessibility expert. The web should be available to everyone, so Trezy uses JavaScript, React, and CSS to accomplish that goal.',
}

export default async function Home() {
	const articles = await Contentful.getAllArticles()

	return (
		<PageContent
			showHeader={false}
			title="Home">
			<header className="block hero">
				<h2>&lt;trezy-who/&gt;</h2>

				<p>Software engineer, UX designer, and <a href="https://a11yproject.com">#a11y</a>.</p>
			</header>

			<section className="block">
				<Container>
					<h2>Latest articles</h2>

					<ArticleList
						articles={articles}
						className="latest-articles"
						includeStyles={false}
						limit={ARTICLE_LIMIT} />

					<Link href="/blog">
						See more
					</Link>
				</Container>
			</section>

			<section className="block center">
				<p>As a software consultant, I've been lucky to work with some of the best teams from well-known brands on products that make the world a better place.</p>

				<ClientList />
			</section>
		</PageContent>
	)
}
