// Module imports
import {
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	destroyCookie,
	setCookie,
} from 'nookies'
import { useColorMode } from 'react-color-mode'
import PropTypes from 'prop-types'





// Local imports
import { useFirebase } from 'hooks/useFirebase'





const AuthContext = React.createContext({
	claims: null,
	isLoaded: false,
	logout: () => {},
	profile: null,
	refreshUser: () => {},
	settings: null,
	updateProfile: () => {},
	updateSettings: () => {},
	user: null,
})





const AuthContextProvider = props => {
	const { children } = props
	const {
		analytics,
		auth,
		firestore,
	} = useFirebase()
	const { updateColorModePreference } = useColorMode()
	const [claims, setClaims] = useState(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [profile, setProfile] = useState(null)
	const [settings, setSettings] = useState(null)
	const [user, setUser] = useState(null)

	const handleProfileSnapshot = useCallback(doc => {
		setProfile({
			...doc.data(),
			id: doc.id,
		})
	}, [setProfile])
	const handleSettingsSnapshot = useCallback(doc => {
		setSettings({
			...doc.data(),
			id: doc.id,
		})
	}, [setSettings])

	const handleAuthStateChange = useCallback(user => {
		if (user) {
			analytics.setUserId(user.uid)
			analytics.setUserProperties({ isAuthor: 1 })
			analytics.logEvent('login', { method: '' })
		}

		setUser(user)
		setIsLoaded(true)
	}, [
		setIsLoaded,
		setUser,
	])

	const handleIDTokenChange = useCallback(user => {
		if (user) {
			user
				.getIdToken()
				.then(idToken => {
					setCookie(null, 'firebaseAuthToken', idToken, {
						maxAge: 60 * 60 * 24 * 30,
						path: '/',
					})
				})
		} else {
			destroyCookie(null, 'firebaseAuthToken')
		}
	}, [])

	const logout = useCallback(() => {
		destroyCookie(null, 'firebaseAuthToken')
		auth.signOut()
	}, [])

	const applyDocumentPatch = useCallback((collection, patch) => {
		return firestore
			.collection(collection)
			.doc(user.uid)
			.update(patch)
	}, [user])

	const refreshUser = useCallback(() => user.reload(), [user])

	const updateProfile = useCallback(profilePatch => {
		applyDocumentPatch('profiles', profilePatch)
	}, [applyDocumentPatch])

	const updateSettings = useCallback(settingsPatch => {
		applyDocumentPatch('settings', settingsPatch)
	}, [applyDocumentPatch])

	useEffect(() => auth.onAuthStateChanged(handleAuthStateChange), [handleAuthStateChange])
	useEffect(() => auth.onIdTokenChanged(handleIDTokenChange), [handleIDTokenChange])

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

	useEffect(async () => {
		let theme = window.localStorage.getItem('theme')

		if (settings?.theme && (settings.theme !== theme)) {
			theme = settings.theme
		}

		if (theme) {
			updateColorModePreference(theme)
		}
	}, [settings])

	return (
		<AuthContext.Provider
			value={{
				claims,
				isLoaded,
				logout,
				profile,
				refreshUser,
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
