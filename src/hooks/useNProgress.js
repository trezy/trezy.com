// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'





// Local variables
let isConfigured = false





export function useNProgress() {
	const router = useRouter()

	useEffect(() => {
		if (!isConfigured) {
			isConfigured = true
			NProgress.configure({ showSpinner: false })
		}

		const startNProgress = () => NProgress.start()
		const finishNProgress = () => NProgress.done()

		router.events.on('routeChangeStart', startNProgress)
		router.events.on('routeChangeError', finishNProgress)
		router.events.on('routeChangeComplete', finishNProgress)

		return () => {
			router.events.off('routeChangeStart', startNProgress)
			router.events.off('routeChangeError', finishNProgress)
			router.events.off('routeChangeComplete', finishNProgress)
		}
	}, [router.events])
}
