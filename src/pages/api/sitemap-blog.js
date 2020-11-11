// Module imports
import moment from 'moment'





// Local imports
import createSitemapEndpoint from 'pages/api/helpers/createSitemapEndpoint'
import firebase from 'helpers/firebase'





const {
	endpoint,
	handler,
} = createSitemapEndpoint(async function() {
	const articles = []

	const articlesSnapshot = await firebase
		.firestore()
		.collection('articles')
		.where('isDraft', '==', false)
		.get()

	articlesSnapshot.forEach(doc => articles.push(doc.data()))

	return {
		urlset: [
			{
				'_attr': {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
			},
			...articles.map(article => {
				const {
					slug,
					updatedAt,
				} = article

				return {
					url: [
						{ loc: `https://trezy.com/blog/${slug}` },
						{ lastmod: moment(updatedAt.toDate()).format('YYYY-MM-DD') },
						{ changefreq: 'yearly' },
					],
				}
			}),
		],
	}
})

export { handler }
export default endpoint
