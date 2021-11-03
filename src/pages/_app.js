// Style imports
/* eslint-disable import/no-unassigned-import */
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'
/* eslint-enable */





// Module imports
import { AnimatePresence } from 'framer-motion'
import { ColorModeContextProvider } from 'react-color-mode'
import { useRouter } from 'next/router'
import NextHead from 'next/head'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext'
import { BannerContextProvider } from 'contexts/BannerContext'
import { ProfilesContextProvider } from 'contexts/ProfilesContext'
import { RemoteConfigContextProvider } from 'contexts/RemoteConfigContext'
import { reportWebVitals } from 'helpers/reportWebVitals'
import { useFontawesome } from 'hooks/useFontawesome'
import { useNProgress } from 'hooks/useNProgress'
import { usePageviews } from 'hooks/usePageviews'
import Banner from 'components/Banner'





function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

export default function App(props) {
	const {
		Component,
		isServer,
		pageProps,
	} = props
	const router = useRouter()

	useFontawesome()
	useNProgress()
	usePageviews()

	return (
		<ColorModeContextProvider>
			<AuthContextProvider>
				<RemoteConfigContextProvider>
					<ProfilesContextProvider>
						<BannerContextProvider>
							<div id="application-wrapper">
								<NextHead>
									<meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />

									<link
										href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap"
										rel="stylesheet" />
								</NextHead>

								<Banner isServer={isServer} />

								<AnimatePresence
									exitBeforeEnter
									onExitComplete={handleExitComplete}>
									<Component
										key={router.route}
										{...pageProps} />
								</AnimatePresence>
							</div>
						</BannerContextProvider>
					</ProfilesContextProvider>
				</RemoteConfigContextProvider>
			</AuthContextProvider>
		</ColorModeContextProvider>
	)
}

export { reportWebVitals }
