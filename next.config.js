/* eslint-env node */

// Module imports
const contentful = require('contentful')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nextSafe = require('next-safe')
const path = require('path')





// Local constants
const isDev = process.env.NODE_ENV !== 'production'





module.exports = {
	async headers() {
		const headers = nextSafe({
			contentSecurityPolicy: {
				'connect-src': [
					"'self'",
					'https://firebaseinstallations.googleapis.com',
					'https://firebaseremoteconfig.googleapis.com',
					'https://firebase.googleapis.com',
					'https://firestore.googleapis.com',
					'https://securetoken.googleapis.com',
					'https://www.googleapis.com',
					'https://api.ipify.org',
					'https://api.themoviedb.org',
					'https://api.twitter.com',
					'https://apis.google.com',
					'https://registry.npmjs.org',
					'https://vitals.vercel-insights.com',
					'https://*.firebaseio.com',
					'https://*.trezy.com',
					'wss://*.firebaseio.com',
				],
				'default-src': [
					"'self'",
					'https://*.firebaseio.com',
					'https://trezy-core.firebaseapp.com',
				],
				'font-src': [
					'https://fonts.gstatic.com',
				],
				'frame-src': [
					'https://codepen.io',
					'https://trezy-core.firebaseapp.com',
				],
				'img-src': [
					"'self'",
					'data:',
					'https://*',
					isDev ? 'http://*' : null,
				],
				'media-src': [
					'https://video.twimg.com',
				],
				'prefetch-src': [
					"'self'",
				],
				'script-src': [
					"'self'",
					"'unsafe-eval'",
					"'unsafe-inline'",
					'https://*.firebaseio.com',
					'https://apis.google.com',
					'https://static.codepen.io',
					`http${isDev ? '' : 's'}://www.googletagmanager.com`,
				],
				'style-src': [
					"'self'",
					"'unsafe-inline'",
					'https://fonts.googleapis.com',
				],
			},
			isDev,
		})

		return [
			{
				source: '/',
				headers,
			},
			{
				source: '/:path*',
				headers,
			},
		]
	},

  images: {
    domains: [
			'images.ctfassets.net',
			'pbs.twimg.com',
		],
  },

	async redirects() {
		const redirects = [
			{
				source: '/profile',
				destination: '/',
				permanent: false,
			},

			{
				source: '/profile/:path*',
				destination: '/',
				permanent: false,
			},

			{
				source: '/settings',
				destination: '/settings/profile',
				permanent: true,
			},

			// Socials
			{
				source: '/discord',
				destination: 'https://discord.gg/ZGeCAqAVac',
				permanent: false,
			},

			{
				source: '/github',
				destination: 'https://github.com/trezy',
				permanent: false,
			},

			{
				source: '/imdb',
				destination: 'https://imdb.com/name/nm5442490',
				permanent: false,
			},

			{
				source: '/instagram',
				destination: 'https://instagram.com/TrezyCodes',
				permanent: false,
			},

			{
				source: '/twitter',
				destination: 'https://twitter.com/TrezyCodes',
				permanent: false,
			},

			{
				source: '/youtube',
				destination: 'https://youtube.com/TrezyCodes1',
				permanent: false,
			},

			// Legacy URLs
			{
				source: '/code-of-conduct',
				destination: '/legal/code-of-conduct',
				permanent: true,
			},
			{
				source: '/cookie-policy',
				destination: '/legal/cookie-policy',
				permanent: true,
			},
			{
				source: '/privacy-policy',
				destination: '/legal/privacy-policy',
				permanent: true,
			},
			{
				source: '/terms-of-service',
				destination: '/legal/terms-of-service',
				permanent: true,
			},
			{
				source: '/index',
				destination: '/',
				permanent: true,
			},
			{
				source: '/mozy',
				destination: '/',
				permanent: true,
			},
		]

		const contentfulClient = contentful.createClient({
			accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
			space: process.env.CONTENTFUL_API_SPACE_ID,
		})
		const contentfulResponse = await contentfulClient
			.getEntries({ content_type: 'article' })

		contentfulResponse.items.forEach(item => {
			redirects.push({
				source: `/blog/${item.sys.id}`,
				destination: `/blog/${item.fields.slug}`,
				permanent: true,
			})

			if (item.fields.oldSlugs) {
				item.fields.oldSlugs.forEach(oldSlug => {
					redirects.push({
						source: `/blog/${oldSlug}`,
						destination: `/blog/${item.fields.slug}`,
						permanent: true,
					})
				})
			}
		})

		return redirects
	},

	async rewrites() {
		return [
			// App
			{
				source: '/@:username',
				destination: '/profile/@:username',
			},

			// RSS
			{
				source: '/rss(.xml)?',
				destination: '/api/blog/rss',
			},
			{
				source: '/blog/rss(.xml)?',
				destination: '/api/blog/rss',
			},

			// Sitemaps
			{
				source: '/sitemap-base.xml',
				destination: '/api/sitemap/base',
			},
			{
				source: '/sitemap-blog.xml',
				destination: '/api/sitemap/blog',
			},
		]
	},

	webpack(config) {
		config.module.rules.push({
			exclude: /node_modules/,
			test: /\.svg$/i,
			use: ['@svgr/webpack'],
		})

		config.plugins.push(new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve('node_modules', 'prismjs', 'components', '*.min.js'),
					to: path.resolve('public', 'prism-grammars', '[name][ext]'),
				},
			],
		}))

		return config
	},
}
