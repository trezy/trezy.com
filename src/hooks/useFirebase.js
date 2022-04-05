// Module imports
import 'firebase/remote-config'





// Local imports
import {
	auth,
	database,
	firebase,
	firestore,
} from 'helpers/firebase'





// Local variables
let remoteConfig = null





export function useFirebase() {
	if (typeof window !== 'undefined') {
		if (!remoteConfig) {
			remoteConfig = firebase.remoteConfig()
		}
	}

	return {
		auth,
		database,
		firebase,
		firestore,
		remoteConfig,
	}
}
