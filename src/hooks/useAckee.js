// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as ackee from 'ackee-tracker'





class Ackee {
	/****************************************************************************\
	 * Private static properties
	\****************************************************************************/

	static #domainID = null

	static #instance = null

	static #isInitialised = false

	static #previousPath = null

	static #url = null





	/****************************************************************************\
	 * Private static methods
	\****************************************************************************/

	static initialise(domainID, url) {
		if (!Ackee.#isInitialised) {
			Ackee.#domainID = domainID
			Ackee.#url = url

			if (typeof window !== 'undefined') {
				Ackee.#instance = ackee.create(Ackee.#url, {
					detailed: false,
					ignoreLocalhost: false,
					ignoreOwnVisits: false,
				})
			}

			Ackee.#isInitialised = true
		}
	}

	static record(path) {
		if (Ackee.#previousPath !== path) {
			const siteLocation = new URL(path, window.location.origin)

			Ackee.#previousPath = path

			Ackee.#instance.record(Ackee.#domainID, {
				...ackee.attributes(),
				siteLocation,
				siteReferrer: document.referrer,
			})
		}
	}
}





export function useAckee() {
	const Router = useRouter()

	useEffect(() => {
		Ackee.initialise(process.env.NEXT_PUBLIC_ACKEE_DOMAIN_ID, process.env.NEXT_PUBLIC_ACKEE_URL)
		Router.events.on('routeChangeComplete', Ackee.record)
		return () => Router.events.off('routeChangeComplete', Ackee.record)
	}, [])

	return {
		'function': () => {},
	}
}
