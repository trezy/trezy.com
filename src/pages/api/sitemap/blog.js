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

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

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

				const updatedAtString = dateFormatter
					.formatToParts(updatedAt.toDate())
					.reduce((accumulator, part) => {
						switch (part.type) {
							case 'day':
								accumulator = accumulator.replace('DD', part.value)
								break

							case 'month':
								accumulator = accumulator.replace('MM', part.value)
								break

							case 'year':
								accumulator = accumulator.replace('YYYY', part.value)
								break
						}

						return accumulator
					}, 'YYYY-MM-DD')

				return {
					url: [
						{ loc: `https://trezy.com/blog/${slug}` },
						{ lastmod: updatedAtString },
						{ changefreq: 'yearly' },
					],
				}
			}),
		],
	}
})

export { handler }
export default endpoint
