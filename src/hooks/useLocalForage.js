// Module imports
import { useEffect } from 'react'
import LocalForage from 'localforage'





// Local variables
let isConfigured = false





export function useLocalForage() {
	useEffect(() => {
		if (!isConfigured) {
			isConfigured = true
			LocalForage.config({
				name: 'Trezy.com',
				storeName: 'webStore',
			})
		}
	}, [])

	return LocalForage
}
