'use client'

// Module imports
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { ThemeProvider } from 'next-themes'

// Local imports
import { ATProtoContextProvider } from 'contexts/ATProtoContext.js'
import { BannerContextProvider } from 'contexts/BannerContext.js'
import Banner from 'components/Banner/index.js'

fontAwesomeConfig.autoAddCss = false

export function ClientProviders({ children }) {
	return (
		<ThemeProvider attribute="data-theme" defaultTheme="system">
			<ATProtoContextProvider>
				<BannerContextProvider>
					<div id="application-wrapper">
						<Banner />
						{children}
					</div>
				</BannerContextProvider>
			</ATProtoContextProvider>
		</ThemeProvider>
	)
}
