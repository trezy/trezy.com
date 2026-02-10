// Module imports
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'




// Local imports
import firebaseConfig from '../../firebase.config'




// Local variables
let app = null
let auth = null
let database = null
let firestore = null




if (!getApps().length) {
	app = initializeApp(firebaseConfig)
} else {
	app = getApp()
}

auth = getAuth(app)
database = getDatabase(app)
firestore = getFirestore(app)




export {
	app,
	auth,
	database,
	firestore,
}
