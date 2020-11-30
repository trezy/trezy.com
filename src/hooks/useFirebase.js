 // Module imports
import firebase from 'firebase/app'
/* eslint-disable import/no-unassigned-import */
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
/* eslint-enable import/no-unassigned-import */





// Local imports
import firebaseConfig from '../../firebase.config'





// Local variables
let auth = null
let database = null
let firestore = null





export function useFirebase() {
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	}

	if (!auth) {
		auth = firebase.auth()
	}

	if (!database) {
		database = firebase.database()
	}

	if (!firestore) {
		firestore = firebase.firestore()
	}

	return {
		auth,
		database,
		firebase,
		firestore,
	}
}
