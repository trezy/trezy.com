// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'





// Local imports
import * as gtag from 'helpers/gtag'





export function usePageviews() {
	const router = useRouter()

	useEffect(() => {
		const handleRouteChange = url => gtag.pageview(url)

		router.events.on('routeChangeComplete', handleRouteChange)

		return () => router.events.off('routeChangeComplete', handleRouteChange)
	}, [router.events])
}
