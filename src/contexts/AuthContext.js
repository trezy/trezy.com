// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	destroyCookie,
	setCookie,
} from 'nookies'
import PropTypes from 'prop-types'





// Local imports
import { useFirebase } from 'hooks/useFirebase'





const AuthContext = React.createContext({
	claims: null,
	profile: null,
	settings: null,
	updateProfile: () => {},
	updateSettings: () => {},
	user: null,
})





const AuthContextProvider = props => {
	const { children } = props
	const {
		auth,
		firestore,
	} = useFirebase()
	const [claims, setClaims] = useState(null)
	const [profile, setProfile] = useState(null)
	const [settings, setSettings] = useState(null)
	const [user, setUser] = useState(null)

	const handleProfileSnapshot = useCallback(doc => setProfile(doc.data()), [setProfile])
	const handleSettingsSnapshot = useCallback(doc => setSettings(doc.data()), [setSettings])

	const handleAuthStateChange = useCallback(user => {
		setUser(user)

		if (user) {
			user
				.getIdToken()
				.then(idToken => {
					setCookie(null, 'firebaseAuthToken', idToken, { maxAge: 60 * 60 * 24 * 30 })
				})
		} else {
			destroyCookie(null, 'firebaseAuthToken')
		}
	}, [setUser])

	const applyDocumentPatch = useCallback((collection, patch) => {
		return firestore
			.collection(collection)
			.doc(user.uid)
			.update(patch)
	}, [user])

	const updateProfile = useCallback(profilePatch => {
		applyDocumentPatch('profiles', profilePatch)
	}, [applyDocumentPatch])

	const updateSettings = useCallback(settingsPatch => {
		applyDocumentPatch('settings', settingsPatch)
	}, [applyDocumentPatch])

	useEffect(() => auth.onAuthStateChanged(handleAuthStateChange), [handleAuthStateChange])

	useEffect(async () => {
		const unsubscribers = []

		if (user) {
			user
				.getIdTokenResult()
				.then(idTokenResult => setClaims(idTokenResult.claims))

			const profileWatcher = firestore
				.collection('profiles')
				.doc(user.uid)
				.onSnapshot(handleProfileSnapshot)

			const settingsWatcher = firestore
				.collection('settings')
				.doc(user.uid)
				.onSnapshot(handleSettingsSnapshot)

			unsubscribers.push(profileWatcher)
			unsubscribers.push(settingsWatcher)
		} else {
			setClaims(null)
			setProfile(null)
			setSettings(null)
		}

		return () => unsubscribers.forEach(unsubscribe => unsubscribe())
	}, [
		handleProfileSnapshot,
		handleSettingsSnapshot,
		setClaims,
		setProfile,
		setSettings,
		user,
	])

	return (
		<AuthContext.Provider
			value={{
				claims,
				profile,
				settings,
				updateProfile,
				updateSettings,
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
