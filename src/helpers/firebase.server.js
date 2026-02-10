// Module imports
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'




// Local variables
let app = null
let auth = null
let firestore = null




if (!getApps().length) {
	app = initializeApp({
		credential: cert({
			auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
			auth_uri: process.env.FIREBASE_AUTH_URI,
			client_email: process.env.FIREBASE_CLIENT_EMAIL,
			client_id: process.env.FIREBASE_CLIENT_ID,
			client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
			private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
			private_key: process.env.FIREBASE_PRIVATE_KEY,
			project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			token_uri: process.env.FIREBASE_TOKEN_URI,
			type: process.env.FIREBASE_TYPE,
		}),
		databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	})
} else {
	app = getApp()
}

auth = getAuth(app)
firestore = getFirestore(app)




export {
	app,
	auth,
	firestore,
}
