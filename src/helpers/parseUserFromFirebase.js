const parseUserFromFirebase = user => {
	if (user) {
		return {
			displayName: user.displayName,
			email: user.email,
			emailVerified: user.emailVerified,
			isAnonymous: user.isAnonymous,
			photoURL: user.photoURL,
			providerData: user.providerData,
			uid: user.uid,
		}
	}

	return null
}





export default parseUserFromFirebase
