// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
// import LocalForage from 'localforage'
import PropTypes from 'prop-types'





// Local imports
import { firestore } from 'helpers/firebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
import { useAuth } from 'contexts/AuthContext'
// import { useAsync } from 'hooks/useAsync'




const ProfilesContext = React.createContext({
	addProfile: () => {},
	connectProfileByUsername: () => {},
	disconnectProfileByUsername: () => {},
	profilesByID: {},
	profilesByUsername: {},
	watchProfile: () => {},
})





const ProfilesContextProvider = props => {
	const { children } = props
	const { user } = useAuth
	const {
		current: collection,
	} = useRef(firestore?.collection('profiles'))
	const connections = useRef({})
	const [profilesByID, setProfilesByID] = useState({})
	const [profilesByUsername, setProfilesByUsername] = useState({})

	const [profilesToWatch, setProfilesToWatch] = useState({})

	const handleSnapshot = useCallback(snapshot => {
		setProfilesByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setProfilesByUsername(updateStateObjectFromSnapshot(snapshot, 'username'))
	}, [
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

	const connectProfileByUsername = useCallback(username => {
		connections.current[`username:${username}`] = collection
			.where('visibility', '!=', 'private')
			.where('username', '==', username)
			.onSnapshot(handleSnapshot)
	}, [handleSnapshot])

	const disconnectProfileByUsername = useCallback(username => {
		const unsubscribe = connections.current[`username:${username}`]

		if (unsubscribe) {
			unsubscribe()
		}
	}, [])

	const connectProfileByID = useCallback(userID => {
		connections.current[`id:${userID}`] = collection
			.doc(userID)
			.onSnapshot(handleSnapshot)
	}, [handleSnapshot])

	const disconnectProfileByID = useCallback(userID => {
		const unsubscribe = connections.current[`id:${userID}`]

		if (unsubscribe) {
			unsubscribe()
		}
	}, [])

	const handleDocumentSnapshotRemoved = useCallback(snapshot => {
		console.log('handleDocumentSnapshotRemoved', {
			data: snapshot.data(),
			id: snapshot.id,
		})
		// const data = {
		// 	...snapshot.data(),
		// 	id: snapshot.id,
		// }

		// setProfilesByID(previousValue => {
		// 	return {
		// 		...previousValue,
		// 		[data.id]: data,
		// 	}
		// })

		// setProfilesByUsername(previousValue => {
		// 	return {
		// 		...previousValue,
		// 		[data.username]: data,
		// 	}
		// })

		// setProfilesToWatch(previousValue => {
		// 	const newValue = { ...previousValue }

		// 	if (!newValue[data.username]) {
		// 		newValue[data.username] = newValue[data.id]
		// 	} else if (!newValue[data.id]) {
		// 		newValue[data.id] = newValue[data.username]
		// 	}

		// 	newValue[data.username].loading = false
		// 	newValue[data.id].loading = false

		// 	return newValue
		// })
	}, [
		setProfilesByID,
		setProfilesByUsername,
		setProfilesToWatch,
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
			const newValue = { ...previousValue }

			if (!newValue[data.username]) {
				newValue[data.username] = newValue[data.id]
			} else if (!newValue[data.id]) {
				newValue[data.id] = newValue[data.username]
			}

			newValue[data.username].loading = false
			newValue[data.id].loading = false

			return newValue
		})
	}, [
		setProfilesByID,
		setProfilesByUsername,
		setProfilesToWatch,
	])

	const handleQuerySnapshot = useCallback(snapshot => {
		snapshot.docChanges().forEach(changes => {
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

	const watchProfile = useCallback(({ username, id }) => {
		useEffect(() => {
			setProfilesToWatch(previousValue => {
				const newValue = { ...previousValue }

				if (!previousValue[username] && !previousValue[id]) {
					let unsubscribe = null

					if (username) {
						unsubscribe = collection
							.where('visibility', '!=', 'private')
							.where('username', '==', username)
							.onSnapshot(handleQuerySnapshot)
					}

					if (id) {
						unsubscribe = collection
							.doc(id)
							.onSnapshot(handleDocumentSnapshot)
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

	return (
		<ProfilesContext.Provider
			value={{
				addProfile,
				connectProfileByUsername,
				disconnectProfileByUsername,
				profilesByID,
				profilesByUsername,
				watchProfile,
			}}>
			{children}
		</ProfilesContext.Provider>
	)
}

ProfilesContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useProfiles = () => useContext(ProfilesContext)





export {
	ProfilesContext,
	ProfilesContextProvider,
	useProfiles,
}
