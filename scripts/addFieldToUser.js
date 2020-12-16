require('dotenv').config()

// Module imports
const firebase = require('firebase-admin')
const mri = require('mri')




const argv = process.argv.slice(2)
const args = mri(argv, {
	alias: {
		c: 'collection',
		d: ['default'],
		f: 'field',
	},

	default: {
		collection: 'profiles',
		default: '',
	},
})

const app = firebase.initializeApp({
	credential: firebase.credential.cert({
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
const firestore = app.firestore()
const usersCollection = firestore.collection('users')

async function addFieldToUsers(collectionName, fieldName, defaultValue = null) {
	console.log(collectionName, fieldName, defaultValue)
	const collection = firestore.collection(collectionName)

	console.log('retrieving user docs...')
	const userDocs = await usersCollection.get()
	console.log('done.')
	const users = []

	console.log('extracting user data from docs...')
	userDocs.forEach(user => {
		users.push({
			...user.data(),
			id: user.id,
		})
	})
	console.log('done.')

	await Promise.all(users.map(async user => {
		const docRef = collection.doc(user.id)

		console.log(`getting collection data for ${user.displayName || user.username || user.id}...`)
		const doc = await docRef.get()
		console.log(`done retrieving collection data for ${user.displayName || user.username || user.id}.`)

		if (!doc.data()[fieldName]) {
			console.log(`updating collection data for ${user.displayName || user.username || user.id}...`)
			await docRef.update({ [fieldName]: defaultValue })
			console.log(`done updating collection data for ${user.displayName || user.username || user.id}.`)
		}
	}))
}

addFieldToUsers(args.collection, args.field, args.default)
