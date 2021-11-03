// Component imports
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import * as Contentful from 'helpers/Contentful'





function Blog(props) {
	const { articles } = props

	return (
		<PageWrapper
			description="New ideas, old ideas, and regular ideas can all be found below the titles of Trezy's titular technological tidings."
			title="Blog">
			<ArticleList articles={articles} />
		</PageWrapper>
	)
}

export async function getStaticProps() {
	const articles = await Contentful.getAllArticles()

	return {
		props: {
			articles,
		},
		revalidate:
			1 /* hours */ *
			60 /* minutes */ *
			60 /* seconds */ *
			1000 /* milliseconds */,
	}
}





export default Blog
