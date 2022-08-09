// Style imports
/* eslint-disable import/no-unassigned-import */
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'
/* eslint-enable */





// Module imports
import { AnimatePresence } from 'framer-motion'
import { ColorModeContextProvider } from 'react-color-mode'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import NextHead from 'next/head'
import { useRouter } from 'next/router'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext.js'
import { BannerContextProvider } from 'contexts/BannerContext.js'
import { ProfilesContextProvider } from 'contexts/ProfilesContext.js'
import { RemoteConfigContextProvider } from 'contexts/RemoteConfigContext.js'
import { reportWebVitals } from 'helpers/reportWebVitals.js'
import { useAnalytics } from 'hooks/useAnalytics.js'
import { useNProgress } from 'hooks/useNProgress.js'
import Banner from 'components/Banner/index.js'





fontAwesomeConfig.autoAddCss = false

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

	useAnalytics()
	useNProgress()

	return (
		<>
			<NextHead>
				<meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />
			</NextHead>

			<ColorModeContextProvider>
				<AuthContextProvider>
					<RemoteConfigContextProvider>
						<ProfilesContextProvider>
							<BannerContextProvider>
								<div id="application-wrapper">
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
		</>
	)
}

export { reportWebVitals }
