/* eslint-env node */

// Module imports
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nextSafe = require('next-safe').default
const path = require('path')
const withGitInfo = require('next-gitinfo')





// Local constants
const isDev = process.env.NODE_ENV !== 'production'





module.exports = withGitInfo({
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
					'https://www.google-analytics.com',
					'https://api.ipify.org',
					'https://api.themoviedb.org',
					'https://apis.google.com',
					'https://*.firebaseio.com',
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
					`http${isDev ? '' : 's'}://platform.twitter.com`,
				],
				'img-src': [
					"'self'",
					'data:',
					'https://*',
				],
				'prefetch-src': [
					"'self'",
				],
				'script-src': [
					"'self'",
					"'unsafe-inline'",
					'https://*.firebaseio.com',
					'https://apis.google.com',
					'https://static.codepen.io',
					`http${isDev ? '' : 's'}://platform.twitter.com`,
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

	async redirects() {
		return [
			{
				source: '/settings',
				destination: '/settings/profile',
				permanent: true,
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
	},

	async rewrites() {
		return [
			{
				source: '/@:username',
				destination: '/profile/@:username',
			},
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
			test: /\.svg$/,
			loader: '@svgr/webpack',
		})

		// config.module.rules.unshift({
		// 	enforce: 'pre',
		// 	exclude: /node_modules/u,
		// 	loader: 'eslint-loader',
		// 	test: /\.js$/u,
		// })

		config.plugins.push(new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve('node_modules', 'prismjs', 'components', '*.min.js'),
					to: path.resolve('public', 'prism-grammars', '[name].[ext]'),
				},
			],
		}))

		return config
	},
})
