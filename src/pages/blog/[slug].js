// Module imports
import { createClient as createContentfulClient } from 'contentful'
import PropTypes from 'prop-types'





// Component imports
import { ArticleMeta } from 'components/ArticleMeta'
import { calculateReadtime } from 'helpers/calculateReadtime'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'





function ArticlePage(props) {
	const { article } = props

	return (
		<PageWrapper
			description={article.synopsis}
			showHeader={false}
			title={createTitleStringFromArticle(article)}>
			<header className="block no-top-margin">
				<h2>{article.title}</h2>

				<ArticleMeta article={article} />
			</header>

			<article className="block">
				<MarkdownRenderer children={article.body} />
			</article>
		</PageWrapper>
	)
}

ArticlePage.propTypes = {
	article: PropTypes.shape({}).isRequired,
}

export async function getStaticPaths() {
	const contentfulClient = createContentfulClient({
		space: process.env.CONTENTFUL_API_SPACE_ID,
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
	})

	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
			select: [
				'fields.slug',
				'fields.oldSlugs',
			],
		})

	const paths = []

	contentfulResponse.items.map(article => {
		paths.push({
			params: {
				slug: article.fields.slug,
			},
		})

		if (article.fields.oldSlugs?.length) {
			article.fields.oldSlugs.forEach(slug => {
				paths.push({
					params: { slug },
				})
			})
		}
	})

	return {
		fallback: true,
		paths,
	}
}

export async function getStaticProps(context) {
	const { slug } = context.params
	const contentfulClient = createContentfulClient({
		space: process.env.CONTENTFUL_API_SPACE_ID,
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
	})

	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
			'fields.slug': slug,
			limit: 1,
		})

	if (!contentfulResponse.total === 0) {
		return { notFound: true }
	}

	const contentfulArticle = contentfulResponse.items[0]

	const article = {
		...contentfulArticle.fields,
		createdAt: contentfulArticle.fields.legacyPublishedAt || contentfulArticle.fields.legacyCreatedAt || contentfulArticle.sys.createdAt,
		readtime: calculateReadtime(contentfulArticle.fields.body),
		updatedAt: contentfulArticle.sys.updatedAt,
	}

	return {
		props: { article },
	}
}

export default ArticlePage
