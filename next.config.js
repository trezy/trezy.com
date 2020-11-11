/* eslint-env node */

// Module imports
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
				],
				'img-src': [
					"'self'",
					'data:',
					'https://*.googleusercontent.com',
					'https://*.twimg.com',
					'https://avatars.dicebear.com',
					'https://firebasestorage.googleapis.com',
					'https://generative-placeholders.glitch.me',
					'https://image.tmdb.org',
				],
				'prefetch-src': [
					"'self'",
				],
				'script-src': [
					"'self'",
					"'unsafe-inline'",
					'https://*.firebaseio.com',
					'https://apis.google.com',
					'https://www.googletagmanager.com',
				],
				'style-src': [
					"'self'",
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

	async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },

	target: 'serverless',

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

		config.plugins.push(new CopyWebpackPlugin([
			{
				flatten: true,
				from: path.resolve('node_modules', 'prismjs', 'components', '*.min.js'),
				to: path.resolve('public', 'prism-grammars'),
			},
		]))

		return config
	},
}
