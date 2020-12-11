// Style imports
/* eslint-disable import/no-unassigned-import */
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'
/* eslint-enable */





// Module imports
import { Provider } from 'react-redux'
import NextApp from 'next/app'
import NextHead from 'next/head'
import withRedux from 'next-redux-wrapper'





// Local imports
import { ArticlesContextProvider } from 'contexts/ArticlesContext'
import { AuthContextProvider } from 'contexts/AuthContext'
import { initStore } from 'store'
import { ProfilesContextProvider } from 'contexts/ProfilesContext'
import { RemoteConfigContextProvider } from 'contexts/RemoteConfigContext'
import { reportWebVitals } from 'helpers/reportWebVitals'
import { useFontawesome } from 'hooks/useFontawesome'
import { useLocalForage } from 'hooks/useLocalForage'
import { useNProgress } from 'hooks/useNProgress'
import { usePageviews } from 'hooks/usePageviews'
import Banner from 'components/Banner'





function App(props) {
	const {
		Component,
		isServer,
		pageProps,
		store,
	} = props

	useFontawesome()
	useNProgress()
	usePageviews()

	return (
		<AuthContextProvider>
			<RemoteConfigContextProvider>
				<ProfilesContextProvider>
					<ArticlesContextProvider>
						<Provider store={store}>
							<div role="application">
								<NextHead>
									<meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />

									<link
										href="https://fonts.googleapis.com/css?family=Source+Code+Pro&amp;display=swap"
										rel="stylesheet" />
								</NextHead>

								<Banner isServer={isServer} />

								<Component {...pageProps} />
							</div>
						</Provider>
					</ArticlesContextProvider>
				</ProfilesContextProvider>
			</RemoteConfigContextProvider>
		</AuthContextProvider>
	)
}

export { reportWebVitals }

export default withRedux(initStore)(App)
