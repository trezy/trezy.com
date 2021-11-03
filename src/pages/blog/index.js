// Module imports
import { createClient as createContentfulClient } from 'contentful'





// Component imports
import { calculateReadtime } from 'helpers/calculateReadtime'
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'





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
					id: item.sys.id,
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





export default Blog
