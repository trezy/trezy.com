// Module imports
import { GoogleAnalytics } from '@next/third-parties/google'
import { Libre_Franklin } from 'next/font/google'
import { unstable_ViewTransition as ViewTransition } from 'react'

// Style imports
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'

// Local imports
import { ClientProviders } from './ClientProviders.js'

const libreFranklin = Libre_Franklin({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-libre-franklin',
})

export const metadata = {
	applicationName: 'Trezy.com',
	title: {
		template: '%s | Trezy.com',
		default: 'Trezy.com',
	},
	other: {
		'apple-mobile-web-app-title': 'Trezy.com',
		'theme-color': '#0092c7',
	},
	icons: {
		apple: '/favicon/apple-touch-icon.png',
		icon: [
			{ url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
	},
	manifest: '/site.webmanifest',
	alternates: {
		types: {
			'application/rss+xml': '/rss.xml',
		},
	},
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={libreFranklin.variable} suppressHydrationWarning>
			<head>
				<link rel="webmention" href="https://webmention.io/trezy.com/webmention" />
				<link rel="pingback" href="https://webmention.io/trezy.com/xmlrpc" />
			</head>

			<body>
				<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />

				<ViewTransition>
					<ClientProviders>
						{children}
					</ClientProviders>
				</ViewTransition>
			</body>
		</html>
	)
}
