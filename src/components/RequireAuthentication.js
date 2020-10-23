// Module imports
import React, {
	useEffect,
} from 'react'
import {
	isEmpty,
	isLoaded,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'





// Local imports
const RequireAuthentication = ({ children }) => {
	const Router = useRouter()
	const auth = useSelector(state => state.firebase.auth)

	useEffect(() => {
		if ((typeof window !== 'undefined') && isLoaded(auth) && isEmpty(auth)) {
			Router.push(`/login?destination=${Router.asPath}`)
		}
	}, [auth])

	if (!isLoaded(auth)) {
		return (
			<section>Verifying authentication...</section>
		)
	}

	if (isEmpty(auth)) {
		return (
			<section>Not logged in; Redirecting...</section>
		)
	}

	return children
}





export default RequireAuthentication
