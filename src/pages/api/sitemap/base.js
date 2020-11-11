// Local imports
import createSitemapEndpoint from 'pages/api/helpers/createSitemapEndpoint'





const {
	endpoint,
	handler,
} = createSitemapEndpoint({
	urlset: [
		{
			'_attr': {
				xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
			},
		},
		{
			url: [
				{ loc: 'https://trezy.com/' },
				{ lastmod: '2020' },
				{ changefreq: 'daily' },
				{ priority: '0.6' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/blog' },
				{ lastmod: '2020' },
				{ changefreq: 'daily' },
				{ priority: '0.7' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/about' },
				{ lastmod: '2020' },
				{ changefreq: 'monthly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/code-of-conduct' },
				{ lastmod: '2019' },
				{ changefreq: 'yearly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/cookie-policy' },
				{ lastmod: '2019' },
				{ changefreq: 'yearly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/login' },
				{ lastmod: '2020' },
				{ changefreq: 'yearly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/privacy-policy' },
				{ lastmod: '2019' },
				{ changefreq: 'yearly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/terms-of-service' },
				{ lastmod: '2019' },
				{ changefreq: 'yearly' },
			],
		},
		{
			url: [
				{ loc: 'https://trezy.com/uses' },
				{ lastmod: '2020' },
				{ changefreq: 'monthly' },
			],
		},
	],
})

export { handler }
export default endpoint
