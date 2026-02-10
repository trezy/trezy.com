// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	collection as firestoreCollection,
	doc,
	limit,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'
import PropTypes from 'prop-types'




// Local imports
import { firestore } from 'helpers/firebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
import { useAuth } from 'contexts/AuthContext'



export const ProfilesContext = createContext({
	addProfile: () => {},
	connectProfiles: () => {},
	isLoaded: false,
	profilesByID: {},
	profilesByUsername: {},
	useProfileWatcher: () => {},
})




export function ProfilesContextProvider(props) {
	const { children } = props
	const {
		claims,
		user,
	} = useAuth()
	const collectionRef = useRef(firestore ? firestoreCollection(firestore, 'profiles') : null)
	const connections = useRef({})
	const connectUnsubscriber = useRef(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [profilesByID, setProfilesByID] = useState({})
	const [profilesByUsername, setProfilesByUsername] = useState({})
	const [profilesToWatch, setProfilesToWatch] = useState({})

	const handleSnapshot = useCallback(snapshot => {
		setProfilesByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setProfilesByUsername(updateStateObjectFromSnapshot(snapshot, 'username'))
		setIsLoaded(true)
	}, [
		setIsLoaded,
		setProfilesByID,
		setProfilesByUsername,
	])

	const addProfile = useCallback(profile => {
		setProfilesByID(previousValue => {
			return {
				...previousValue,
				[profile.id]: profile,
			}
		})
		setProfilesByUsername(previousValue => {
			return {
				...previousValue,
				[profile.username]: profile,
			}
		})
	}, [
		setProfilesByID,
		setProfilesByUsername,
	])

	const handleDocumentSnapshotRemoved = useCallback(snapshot => {
		const data = {
			...snapshot.data(),
			id: snapshot.id,
		}

		setProfilesByID(previousValue => {
			const newValue = { ...previousValue }
			delete newValue[data.id]
			return newValue
		})

		setProfilesByUsername(previousValue => {
			const newValue = { ...previousValue }
			delete newValue[data.username]
			return newValue
		})
	}, [
		setProfilesByID,
		setProfilesByUsername,
	])

	const handleDocumentSnapshot = useCallback(snapshot => {
		const data = {
			...snapshot.data(),
			id: snapshot.id,
		}

		setProfilesByID(previousValue => {
			return {
				...previousValue,
				[data.id]: data,
			}
		})

		setProfilesByUsername(previousValue => {
			return {
				...previousValue,
				[data.username]: data,
			}
		})

		setProfilesToWatch(previousValue => {
			if (previousValue[data.username] || previousValue[data.id]) {
				const newValue = { ...previousValue }

				if (!newValue[data.username]) {
					newValue[data.username] = newValue[data.id]
				} else if (!newValue[data.id]) {
					newValue[data.id] = newValue[data.username]
				}

				newValue[data.username].loading = false
				newValue[data.id].loading = false

				return newValue
			}

			return previousValue
		})

		setIsLoaded(true)
	}, [
		setIsLoaded,
		setProfilesByID,
		setProfilesByUsername,
		setProfilesToWatch,
	])

	const handleQuerySnapshot = useCallback(snapshot => {
		snapshot.docChanges().forEach(change => {
			const {
				doc,
				type,
			} = change

			if (['added', 'modified'].includes(type)) {
				handleDocumentSnapshot(doc)
			} else if (type === 'removed') {
				handleDocumentSnapshotRemoved(doc)
			}
		})
	}, [handleDocumentSnapshot])

	const useProfileWatcher = useCallback(contextProps => {
		const {
			id,
			onRemoved,
			username,
		} = contextProps
		useEffect(() => {
			const collection = collectionRef.current
			if (!collection) return

			setProfilesToWatch(previousValue => {
				const newValue = { ...previousValue }

				if (!previousValue[username] && !previousValue[id]) {
					let unsubscribe = null

					if (username) {
						const q = query(
							collection,
							where('visibility', '!=', 'private'),
							where('username', '==', username),
						)
						unsubscribe = onSnapshot(q, handleQuerySnapshot)
					}

					if (id) {
						const docRef = doc(firestore, 'profiles', id)
						unsubscribe = onSnapshot(docRef, handleDocumentSnapshot)
					}

					newValue[username || id] = {
						loading: true,
						unsubscribe,
						watcherCount: 0,
					}
				}

				newValue[username || id].watcherCount += 1

				return newValue
			})

			return () => {
				setProfilesToWatch(previousValue => {
					const newValue = { ...previousValue }

					if (previousValue[username || id].watchCount <= 1) {
						newValue[username || id].unsubscribe()
						delete newValue[username || id]
					}

					return newValue
				})
			}
		}, [
			handleQuerySnapshot,
			handleDocumentSnapshot,
			setProfilesToWatch,
		])
	}, [
		handleQuerySnapshot,
		handleDocumentSnapshot,
		setProfilesToWatch,
	])

	const connectProfiles = useCallback(() => {
		useEffect(() => {
			const collection = collectionRef.current
			if (!collection) return

			const q = query(collection, limit(50))

			return onSnapshot(q, handleQuerySnapshot)
		}, [
			claims,
			handleQuerySnapshot,
		])
	}, [
		claims,
		handleQuerySnapshot,
	])

	return (
		<ProfilesContext.Provider
			value={{
				addProfile,
				connectProfiles,
				isLoaded,
				profilesByID,
				profilesByUsername,
				useProfileWatcher,
			}}>
			{children}
		</ProfilesContext.Provider>
	)
}

ProfilesContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export const useProfiles = () => useContext(ProfilesContext)
