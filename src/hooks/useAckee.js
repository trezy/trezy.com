// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import { useRouter } from 'next/router'
import * as ackee from 'ackee-tracker'





// Local imports
import { useAuth } from 'contexts/AuthContext.js'





export class Ackee {
	/****************************************************************************\
	 * Private static properties
	\****************************************************************************/

	static #detailedModeEnabled = false

	static #domainID = null

	static #instance = null

	static #isInitialised = false

	static #previousPath = null

	static #queue = []

	static #stopRecord = null

	static #url = null





	/****************************************************************************\
	 * Private static methods
	\****************************************************************************/

	static createRecord(config) {
		if (process.env.NEXT_PUBLIC_DISABLE_ACKEE) {
			return
		}

		const {
			detailedMode,
			path,
		} = config

		const siteLocation = new URL(path, window.location.origin)

		const { stop } = Ackee.#instance.record(Ackee.#domainID, {
			...ackee.attributes(detailedMode),
			siteLocation,
			siteReferrer: document.referrer,
		})

		Ackee.#detailedModeEnabled = detailedMode
		Ackee.#stopRecord = stop
	}

	static disableDetailedMode() {
		Ackee.#stopRecord?.()
		Ackee.createRecord({ detailedMode: false })
	}

	static enableDetailedMode() {
		Ackee.#stopRecord?.()
		Ackee.createRecord({ detailedMode: true })
	}

	static initialise(options) {
		if (process.env.NEXT_PUBLIC_DISABLE_ACKEE) {
			return
		}

		if (!Ackee.#isInitialised) {
			const {
				detailedMode,
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
					detailed: detailedMode,
					ignoreLocalhost,
					ignoreOwnVisits,
				})
			}

			Ackee.#isInitialised = true

			Ackee.processQueue()
		}
	}

	static processQueue() {
		while (this.#queue.length) {
			const [
				method,
				...args
			] = this.#queue.shift()

			this.#instance[method](...args)
		}
	}

	static record(path, detailedMode) {
		if (Ackee.#previousPath !== path) {
			Ackee.#previousPath = path

			Ackee.createRecord({
				detailedMode,
				path,
			})
		}
	}

	static trackAction(eventID, config) {
		if (process.env.NEXT_PUBLIC_DISABLE_ACKEE) {
			return
		}

		if (this.#isInitialised) {
			Ackee.#instance.action(eventID, config)
		} else {
			this.#queue.push(['action', eventID, config])
		}
	}





	/****************************************************************************\
	 * Public static getters/setters
	\****************************************************************************/

	static get detailedModeEnabled() {
		return Ackee.#detailedModeEnabled
	}
}





export function useAckee() {
	const Router = useRouter()
	const { settings } = useAuth()

	const record = useCallback(path => {
		Ackee.record(path, settings?.allowDetailedAnalytics)
	}, [settings])

	const trackAction = useCallback((eventID, config) => {
		Ackee.trackAction(eventID, config)
	}, [])

	useEffect(() => {
		Ackee.initialise({
			detailedMode: settings?.allowDetailedAnalytics,
			domainID: process.env.NEXT_PUBLIC_ACKEE_DOMAIN_ID,
			ignoreLocalhost: process.env.NODE_ENV === 'production',
			url: process.env.NEXT_PUBLIC_ACKEE_URL,
		})

		Router.events.on('routeChangeComplete', record)

		return () => Router.events.off('routeChangeComplete', record)
	}, [])

	useEffect(() => {
		if (settings !== null) {
			if (settings.allowDetailedAnalytics && !Ackee.detailedModeEnabled) {
				Ackee.enableDetailedMode()
			} else if (!settings.allowDetailedAnalytics && Ackee.detailedModeEnabled) {
				Ackee.disableDetailedMode()
			}
		}
	}, [settings])

	return { trackAction }
}
