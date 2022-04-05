// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import * as ackee from 'ackee-tracker'





// Variables
let ackeeInstance = null





function createRecord() {
	ackeeInstance.record(process.env.NEXT_PUBLIC_ACKEE_DOMAIN_ID, {
		...ackee.attributes(),
		siteLocation: window.location.href,
		siteReferrer: document.referrer,
	})
}





export function useAckee() {
	const Router = useRouter()

	if (!ackeeInstance && (typeof window !== 'undefined')) {
		ackeeInstance = ackee.create(process.env.NEXT_PUBLIC_ACKEE_URL, {
			detailed: false,
			ignoreLocalhost: false,
			ignoreOwnVisits: false,
		})
	}

	useEffect(() => {
		Router.events.on('routeChangeComplete', createRecord)
		return () => Router.events.off('routeChangeComplete', createRecord)
	}, [])
}
