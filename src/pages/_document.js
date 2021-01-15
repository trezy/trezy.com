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
				<meta name="application-name" content="Trezy.com" />
				<meta name="theme-color" content="#d65050" />

				<meta name="apple-mobile-web-app-title" content="Trezy.com" />

				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#d65050" />
				<meta name="msapplication-TileImage" content="/static/favicon/mstile-144x144.png" />
				<meta name="msapplication-square70x70logo" content="/static/favicon/mstile-70x70.png" />
				<meta name="msapplication-square150x150logo" content="/static/favicon/mstile-150x150.png" />
				<meta name="msapplication-wide310x150logo" content="/static/favicon/mstile-310x150.png" />
				<meta name="msapplication-square310x310logo" content="/static/favicon/mstile-310x310.png" />

				<link rel="apple-touch-icon-precomposed" sizes="57x57" href="/static/favicon/apple-touch-icon-57x57.png" />
				<link rel="apple-touch-icon-precomposed" sizes="60x60" href="/static/favicon/apple-touch-icon-60x60.png" />
				<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/static/favicon/apple-touch-icon-72x72.png" />
				<link rel="apple-touch-icon-precomposed" sizes="76x76" href="/static/favicon/apple-touch-icon-76x76.png" />
				<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/static/favicon/apple-touch-icon-114x114.png" />
				<link rel="apple-touch-icon-precomposed" sizes="120x120" href="/static/favicon/apple-touch-icon-120x120.png" />
				<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/static/favicon/apple-touch-icon-144x144.png" />
				<link rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/favicon/apple-touch-icon-152x152.png" />

				<link rel="icon" type="image/png" href="/static/favicon/favicon-16.png" sizes="16x16" />
				<link rel="icon" type="image/png" href="/static/favicon/favicon-32.png" sizes="32x32" />
				<link rel="icon" type="image/png" href="/static/favicon/favicon-96.png" sizes="96x96" />

				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon/favicon.ico" />

				<link rel="webmention" href="https://webmention.io/trezy.com/webmention" />
				<link rel="pingback" href="https://webmention.io/trezy.com/xmlrpc" />

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
