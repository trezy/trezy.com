// Module imports
import React, {
	useCallback,
	useContext,
useEffect,
	useState,
} from 'react'
// import LocalForage from 'localforage'
import PropTypes from 'prop-types'





// Local imports
import { auth } from 'helpers/firebase'





const AuthContext = React.createContext({
	claims: {},
	user: null,
})





const AuthContextProvider = props => {
	const { children } = props
	const [claims, setClaims] = useState({})
	const [user, setUser] = useState(null)

	useEffect(() => auth.onAuthStateChanged(setUser), [setUser])

	useEffect(async () => {
		if (user) {
			const idTokenResult = await user.getIdTokenResult()
			setClaims(idTokenResult.claims)
		}
	}, [
		setClaims,
		user,
	])

	return (
		<AuthContext.Provider
			value={{
				claims,
				user,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useAuth = () => useContext(AuthContext)





export {
	AuthContext,
	AuthContextProvider,
	useAuth,
}
