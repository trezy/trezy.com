// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'





// Local imports
import { useFirebase } from 'hooks/useFirebase'





export function usePageviews() {
	const router = useRouter()
	const { analytics } = useFirebase()

	useEffect(() => {
		const handleRouteChange = url => analytics.logEvent('page_view', { page_path: url })

		router.events.on('routeChangeComplete', handleRouteChange)

		return () => router.events.off('routeChangeComplete', handleRouteChange)
	}, [router.events])
}
