// Style imports
/* eslint-disable import/no-unassigned-import */
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'
/* eslint-enable */





// Module imports
import { createFirestoreInstance } from 'redux-firestore'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import NextApp from 'next/app'
import NextHead from 'next/head'
import withRedux from 'next-redux-wrapper'





// Local imports
import { ArticlesContextProvider } from 'contexts/ArticlesContext'
import { AuthContextProvider } from 'contexts/AuthContext'
import { initStore } from 'store'
import { ProfilesContextProvider } from 'contexts/ProfilesContext'
import { reportWebVitals } from 'helpers/reportWebVitals'
import { useFontawesome } from 'hooks/useFontawesome'
import { useLocalForage } from 'hooks/useLocalForage'
import { useNProgress } from 'hooks/useNProgress'
import { usePageviews } from 'hooks/usePageviews'
import Banner from 'components/Banner'
import firebase from 'helpers/firebase'





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

	const rrfProps = {
		firebase,
		config: {
			enableClaims: true,
			presence: 'presence',
			sessions: 'sessions',
			useFirestoreForProfile: true,
			userProfile: 'users',
		},
		createFirestoreInstance,
		dispatch: store.dispatch,
	}

	return (
		<AuthContextProvider>
			<ProfilesContextProvider>
				<ArticlesContextProvider>
					<Provider store={store}>
						<ReactReduxFirebaseProvider {...rrfProps}>
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
						</ReactReduxFirebaseProvider>
					</Provider>
				</ArticlesContextProvider>
			</ProfilesContextProvider>
		</AuthContextProvider>
	)
}

export { reportWebVitals }

export default withRedux(initStore)(App)
