// Module imports
import NextDocument, {
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document'
import { ColorModeScript } from 'react-color-mode'





function Document() {
	return (
		<Html>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />

				<meta name="application-name" content="Trezy.com" />
				<meta name="theme-color" content="#0092c7" />

				<meta name="apple-mobile-web-app-title" content="Trezy.com" />

				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest"></link>

				<link rel="webmention" href="https://webmention.io/trezy.com/webmention" />
				<link rel="pingback" href="https://webmention.io/trezy.com/xmlrpc" />

				<link
					href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap"
					rel="stylesheet" />

				<ColorModeScript />
			</Head>

			<body>
				<Main className="next-wrapper" />
				<NextScript />
			</body>
		</Html>
	)
}

Document.renderDocument = NextDocument.renderDocument
Document.getInitialProps = NextDocument.getInitialProps





export default Document
