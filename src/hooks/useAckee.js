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

	static initialise(options) {
		if (!Ackee.#isInitialised) {
			const {
				domainID,
				ignoreLocalhost = true,
				ignoreOwnVisits = true,
				url,
			} = options

			if (!domainID || !url) {
				throw new Error('Ackee cannot be initialised without a `domainID` and a `url`')
			}

			Ackee.#domainID = domainID
			Ackee.#url = url

			if (typeof window !== 'undefined') {
				Ackee.#instance = ackee.create(Ackee.#url, {
					detailed: false,
					ignoreLocalhost,
					ignoreOwnVisits,
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
		Ackee.initialise({
			domainID: process.env.NEXT_PUBLIC_ACKEE_DOMAIN_ID,
			ignoreLocalhost: process.env.NODE_ENV === 'production',
			url: process.env.NEXT_PUBLIC_ACKEE_URL,
		})

		Router.events.on('routeChangeComplete', Ackee.record)

		return () => Router.events.off('routeChangeComplete', Ackee.record)
	}, [])

	return {
		'function': () => {},
	}
}
