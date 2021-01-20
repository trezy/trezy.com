// Module imports
const { AkismetClient } = require('akismet-api')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const uuid = require('uuid')
const isEqual = require('lodash/isEqual')
const xor = require('lodash/xor')





// Firebase setup
admin.initializeApp()

const auth = admin.auth()
const firestore = admin.firestore()

// Akismet setup
const akismet = new AkismetClient({
	blog: 'https://trezy.com',
	key: functions.config().akismet.key,
})





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

const verifyResponseWithAkismet = async snapshot => {
	const { id } = snapshot
	const response = snapshot.data()
	let isPendingHumanVerification = false

	const author = await firestore.collection('users').doc(response.authorID).get()

	const spamCheckData = {
		content: response.body,
		date: response.publishedAt.toDate(),
		ip: response.spamCheck.ip,
		useragent: response.spamCheck.useragent,
	}

	if (author.email) {
		spamCheckData.email = author.email
	}

	if (author.displayName) {
		spamCheckData.name = author.displayName
	}

	const isSpam = await akismet.checkSpam(spamCheckData)

	await firestore.collection('responses').doc(id).update({
		isPendingAkismetVerification: false,
		isPendingHumanVerification: isSpam,
	})
}

const verifyResponseWithHuman = async snapshot => {
	const { id } = snapshot
	const response = snapshot.data()

	if (verifiedByID) {
		const verifiedBy = await firestore.collection('users').doc(response.verifiedByID).get()

		if (verifiedBy) {
			delete response.spamCheck

			return firestore.collection('responses').doc(id).set({
				...response,
				isPendingHumanVerification: false,
				isSpam: false,
			})
		}
	}

	return firestore.collection('responses').doc(id).update({
		isPendingHumanVerification: false,
		isSpam: true,
	})
}





// Handlers
exports.onResponseCreate = functions.firestore.document('responses/{responseID}').onCreate(verifyResponseWithAkismet)

exports.onResponseUpdate = functions.firestore.document('responses/{responseID}').onUpdate(async (snapshot, context) => {
	const {
		body,
		isPendingHumanVerification,
		isSpam,
	} = snapshot.before.data()
	const newData = snapshot.before.data()

	if (newData.body !== body) {
		await firestore.collection('responses').doc(snapshot.after.id).update({ isPendingAkismetVerification: true })
		verifyResponseWithAkismet(snapshot.after)
	} else if (isPendingHumanVerification) {
		verifyResponseWithHuman(snapshot.after)
	}
})

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
