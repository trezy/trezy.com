// Module imports
import { getRemoteConfig } from 'firebase/remote-config'




// Local imports
import {
	app,
	auth,
	database,
	firestore,
} from 'helpers/firebase'




// Local variables
let remoteConfig = null




export function useFirebase() {
	if (typeof window !== 'undefined') {
		if (!remoteConfig) {
			remoteConfig = getRemoteConfig(app)
		}
	}

	return {
		auth,
		database,
		firestore,
		remoteConfig,
	}
}
