// Local imports
import createSitemapEndpoint from 'pages/api/helpers/createSitemapEndpoint'





const {
	endpoint,
	handler,
} = createSitemapEndpoint({
	sitemapindex: [
		{
			'_attr': {
				xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
			},
		},
		{
			sitemap: [
				{ loc: 'https://trezy.com/sitemap-base.xml' }
			]
		},
		{
			sitemap: [
				{ loc: 'https://trezy.com/sitemap-blog.xml' }
			]
		},
	],
})

export { handler }
export default endpoint
