// Module imports
import React, {
	useEffect,
} from 'react'
import {
	isEmpty,
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import { useRouter } from 'next/router'





// Local imports
import useAuthSelector from 'store/selectors/useAuthSelector'
import useCurrentUserSelector from 'store/selectors/useCurrentUserSelector'





export default function ProfileRedirect() {
	const auth = useAuthSelector()
	const currentUser = useCurrentUserSelector()
	const Router = useRouter()
	const collections = []

	if (isLoaded(auth) && !isEmpty(auth)) {
		collections.push({
			collection: 'users',
			doc: auth.uid,
		})
	}

	useFirestoreConnect(collections)

	useEffect(() => {
		if (isLoaded(currentUser) && !isEmpty(currentUser)) {
			Router.replace(`/profile/@${currentUser.username}`)
		}
	}, [])

	return null
}
