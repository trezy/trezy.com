// Local imports
import ArticleList from 'components/ArticleList'
import { PageContent } from 'components/PageContent.js'
import * as Contentful from 'helpers/Contentful'

export const revalidate = 3600

export const metadata = {
	title: 'Blog',
	description: "New ideas, old ideas, and regular ideas can all be found below the titles of Trezy's titular technological tidings.",
}

export default async function Blog() {
	const articles = await Contentful.getAllArticles()

	return (
		<PageContent title="Blog">
			<ArticleList articles={articles} />
		</PageContent>
	)
}
