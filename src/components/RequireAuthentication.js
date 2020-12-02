// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'





// Local imports
import { useAuth } from 'contexts/AuthContext'





// Local imports
const RequireAuthentication = ({ children }) => {
	const {
		isLoaded,
		user,
	} = useAuth()
	const router = useRouter()

	useEffect(() => {
		if ((typeof window !== 'undefined') && isLoaded && !user) {
			router.push(`/login?destination=${router.asPath}`)
		}
	}, [
		isLoaded,
		user,
	])

	if (!isLoaded) {
		return (
			<section>Verifying authentication...</section>
		)
	}

	if (!user) {
		return (
			<section>Not logged in; Redirecting...</section>
		)
	}

	return children
}





export default RequireAuthentication
