// Module imports
import 'firebase/analytics'
import 'firebase/remote-config'





// Local imports
import {
	auth,
	database,
	firebase,
	firestore,
} from 'helpers/firebase'





// Local variables
let analytics = null
let remoteConfig = null





export function useFirebase() {
	if (typeof window !== 'undefined') {
		if (!remoteConfig) {
			remoteConfig = firebase.remoteConfig()
		}
		if (!analytics) {
			analytics = firebase.analytics()
		}
	}

	return {
		analytics,
		auth,
		database,
		firebase,
		firestore,
		remoteConfig,
	}
}
