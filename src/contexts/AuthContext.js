// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	destroyCookie,
	setCookie,
} from 'nookies'
import {
	onAuthStateChanged,
	onIdTokenChanged,
	signOut,
} from 'firebase/auth'
import {
	collection,
	doc,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import { useTheme } from 'next-themes'
import PropTypes from 'prop-types'




// Local imports
import { useFirebase } from 'hooks/useFirebase.js'




export const AuthContext = createContext({
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




export function AuthContextProvider(props) {
	const { children } = props
	const {
		auth,
		firestore,
	} = useFirebase()
	const { setTheme } = useTheme()
	const [claims, setClaims] = useState(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [profile, setProfile] = useState(null)
	const [settings, setSettings] = useState(null)
	const [user, setUser] = useState(null)

	const handleProfileSnapshot = useCallback(docSnap => {
		setProfile({
			...docSnap.data(),
			id: docSnap.id,
		})
	}, [setProfile])
	const handleSettingsSnapshot = useCallback(docSnap => {
		setSettings({
			...docSnap.data(),
			id: docSnap.id,
		})
	}, [setSettings])

	const handleAuthStateChange = useCallback(user => {
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
		signOut(auth)
	}, [auth])

	const applyDocumentPatch = useCallback((collectionName, patch) => {
		const docRef = doc(firestore, collectionName, user.uid)
		return updateDoc(docRef, patch)
	}, [firestore, user])

	const refreshUser = useCallback(() => user.reload(), [user])

	const updateProfile = useCallback(profilePatch => {
		applyDocumentPatch('profiles', profilePatch)
	}, [applyDocumentPatch])

	const updateSettings = useCallback(settingsPatch => {
		applyDocumentPatch('settings', settingsPatch)
	}, [applyDocumentPatch])

	useEffect(() => onAuthStateChanged(auth, handleAuthStateChange), [auth, handleAuthStateChange])
	useEffect(() => onIdTokenChanged(auth, handleIDTokenChange), [auth, handleIDTokenChange])

	useEffect(() => {
		const unsubscribers = []

		if (user) {
			user
				.getIdTokenResult()
				.then(idTokenResult => setClaims(idTokenResult.claims))

			const profileRef = doc(firestore, 'profiles', user.uid)
			const settingsRef = doc(firestore, 'settings', user.uid)

			const profileWatcher = onSnapshot(profileRef, handleProfileSnapshot)
			const settingsWatcher = onSnapshot(settingsRef, handleSettingsSnapshot)

			unsubscribers.push(profileWatcher)
			unsubscribers.push(settingsWatcher)
		} else {
			setClaims(null)
			setProfile(null)
			setSettings(null)
		}

		return () => unsubscribers.forEach(unsubscribe => unsubscribe())
	}, [
		firestore,
		handleProfileSnapshot,
		handleSettingsSnapshot,
		setClaims,
		setProfile,
		setSettings,
		user,
	])

	useEffect(() => {
		if (settings?.theme) {
			setTheme(settings.theme)
		}
	}, [settings, setTheme])

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

export const useAuth = () => useContext(AuthContext)
