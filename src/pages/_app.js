// Style imports
/* eslint-disable import/no-unassigned-import */
import 'scss/reset.scss'
import 'scss/lib.scss'
import 'scss/app.scss'
/* eslint-enable */





// Module imports
import { Provider as LyketProvider } from '@lyket/react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { ColorModeContextProvider } from 'react-color-mode'
import NextHead from 'next/head'
import {
	config,
	library,
} from '@fortawesome/fontawesome-svg-core'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext.js'
import { BannerContextProvider } from 'contexts/BannerContext.js'
import { ProfilesContextProvider } from 'contexts/ProfilesContext.js'
import { RemoteConfigContextProvider } from 'contexts/RemoteConfigContext.js'
import { reportWebVitals } from 'helpers/reportWebVitals.js'
import { useNProgress } from 'hooks/useNProgress.js'
import * as fasIcons from 'helpers/fasIconLibrary'
import * as fabIcons from 'helpers/fabIconLibrary'
import * as farIcons from 'helpers/farIconLibrary'
import Banner from 'components/Banner/index.js'





config.autoAddCss = false
library.add(fasIcons)
library.add(fabIcons)
library.add(farIcons)

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

	useNProgress()

	return (
		<LyketProvider apiKey={process.env.NEXT_PUBLIC_LYKET_API_KEY}>
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
		</LyketProvider>
	)
}

export { reportWebVitals }
