// Local imports
import * as Contentful from './Contentful.js'





export async function getArticlesAsStaticPaths() {
	const articles = await Contentful.getAllArticles()

	return {
		fallback: true,
		paths: articles.map(article => ({
			params: {
				slug: article.slug,
			},
		})),
	}
}
