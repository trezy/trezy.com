// Module imports
import LocalForage from 'localforage'





// Local variables
let isConfigured = false





export function useLocalForage() {
	if (!isConfigured) {
		isConfigured = true
		LocalForage.config({
			name: 'Trezy.com',
			storeName: 'webStore',
		})
	}

	return LocalForage
}
