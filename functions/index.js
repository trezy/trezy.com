// Module imports
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const uuid = require('uuid')
const isEqual = require('lodash/isEqual')
const xor = require('lodash/xor')





// Firebase setup
admin.initializeApp()

const auth = admin.auth()
const firestore = admin.firestore()





// Helpers
const updateUserClaims = async snapshot => {
	const {
		roles: userRoles,
	} = snapshot.data()
	const { customClaims } = await auth.getUser(snapshot.id)
	let newClaims = {}

	const rolesSnapshot = await firestore.collection('roles').get()
	const allRoles = {}
	rolesSnapshot.forEach(role => {
		allRoles[role.id] = role.data().claims
	})

	Object.entries(allRoles).forEach(([role, claims]) => {
		if (userRoles.includes(role)) {
			claims.forEach(claim => {
				newClaims[claim] = true
			})
		}
	})

	if (!isEqual(customClaims, newClaims)) {
		await auth.setCustomUserClaims(snapshot.id, newClaims)
		await firestore.collection('users').doc(snapshot.id).update({ refreshToken: uuid() })
	}
}





// Handlers
exports.onUserCreate = functions.firestore.document('users/{userID}').onCreate(updateUserClaims)

exports.onUserUpdate = functions.firestore.document('users/{userID}').onUpdate((snapshot, context) => {
	const oldRoles = snapshot.before.data().roles
	const newRoles = snapshot.after.data().roles

	if (xor(oldRoles, newRoles).length) {
		updateUserClaims(snapshot.after)
	}
})

exports.onUserRegister = functions.auth.user().onCreate(async user => {
	await Promise.all([
		firestore.collection('profiles').doc(user.uid).set({
			avatarURL: user.photoURL || '',
			bio: '',
			displayName: user.displayName || '',
			username: user.displayName?.toLowerCase().replace(/\s/gu, '-').replace(/[^\w]/gu, '') || '',
			visibility: 'private',
			website: '',
		}),
		firestore.collection('settings').doc(user.uid).set({
			email: user.email || '',
			role: 'member',
			theme: 'system',
		}),
	])
})
