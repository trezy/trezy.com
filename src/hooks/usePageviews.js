// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'





// Local imports
import { useAnalytics } from 'hooks/useAnalytics'





export function usePageviews() {
	const router = useRouter()
	const analytics = useAnalytics()

	useEffect(() => {
		const handleRouteChange = url => analytics.pageview(url)

		router.events.on('routeChangeComplete', handleRouteChange)

		return () => router.events.off('routeChangeComplete', handleRouteChange)
	}, [router.events])
}
