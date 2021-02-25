// Local imports
import {
	auth,
	firestore,
} from 'helpers/firebase.server'
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const { firebaseAuthToken } = request.cookies
	const errors = []
	const profilesCollection = firestore.collection('profiles')
	const settingsCollection = firestore.collection('settings')
	const users = {}
	let nextPageToken = null

	if (!firebaseAuthToken) {
		response.status(httpStatus.UNAUTHORIZED)
		response.end()
		return
	}

	const userClaims = await auth.verifyIdToken(firebaseAuthToken, true)

	if (!userClaims['views.admin.users']) {
		response.status(httpStatus.FORBIDDEN)
		response.end()
		return
	}

	try {
		const {
			pageToken,
			users: userRecords,
		} = await auth.listUsers(1000, request.query.nextPageToken)
		nextPageToken = pageToken

		const profilePromises = []
		const settingsPromises = []
		userRecords.forEach(userRecord => {
			users[userRecord.uid] = {
				auth: userRecord.toJSON(),
				profile: null,
				settings: null,
			}
			profilePromises.push(profilesCollection.doc(userRecord.uid).get())
			settingsPromises.push(settingsCollection.doc(userRecord.uid).get())
		})

		const profileDocs = await Promise.all(profilePromises)
		const settingsDocs = await Promise.all(settingsPromises)

		profileDocs.forEach(snapshot => {
			users[snapshot.id].profile = snapshot.data()
		})
		settingsDocs.forEach(snapshot => {
			users[snapshot.id].settings = snapshot.data()
		})
	} catch (error) {
		errors.push(error.message)
		response.status(httpStatus.INTERNAL_SERVER_ERROR)
		response.json({ errors })
		response.end()
		return
	}

	response.status(httpStatus.OK)
	response.json({
		nextPageToken,
		users: Object.values(users),
	})
	response.end()
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
