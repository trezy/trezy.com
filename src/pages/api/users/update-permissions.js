// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.server'
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function addRoleToUser(roleID, userID) {
	await firestore
		.collection('settings')
		.doc(userID)
		.update({ role: roleID })
}

function createPermissionsObject(permissions) {
	return permissions.reduce((accumulator, permission) => {
		accumulator[permission] = true
		return accumulator
	}, {})
}

async function getRolePermissions(roleID) {
	const role = await firestore.collection('roles').doc(roleID).get()
	return createPermissionsObject(role.data().permissions)
}

async function updateUserClaims(userID, newClaims) {
	// Reset all claims
	await auth.setCustomUserClaims(userID, null)

	// Set new claims
	return auth.setCustomUserClaims(userID, newClaims)
}

export const handler = async (request, response) => {
	const {
		roleID,
		userID,
	} = request.body
	const {
		firebaseAuthToken,
	} = request.cookies
	const errors = []

	if (!firebaseAuthToken) {
		response.status(httpStatus.UNAUTHORIZED)
		response.end()
		return
	}

	const userClaims = await auth.verifyIdToken(firebaseAuthToken, true)

	if (!userClaims['actions.user.editPermissions']) {
		response.status(httpStatus.FORBIDDEN)
		response.end()
		return
	}

	if (!roleID) {
		errors.push('roleID is required.')
	}

	if (!userID) {
		errors.push('userID is required.')
	}

	if (errors.length) {
		response.status(httpStatus.UNPROCESSABLE_ENTITY)
		response.json({ errors })
		response.end()
		return
	}

	try {
		const permissions = await getRolePermissions(roleID)

		await Promise.all([
			updateUserClaims(userID, permissions),
			addRoleToUser(roleID, userID),
		])
	} catch (error) {
		errors.push(error)
		response.status(httpStatus.INTERNAL_SERVER_ERROR)
		response.json({ errors })
		response.end()
		return
	}

	response.status(httpStatus.OK)
	response.end()
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
