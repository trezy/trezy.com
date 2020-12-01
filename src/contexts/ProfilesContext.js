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

	return (
		<ProfilesContext.Provider
			value={{
				addProfile,
				connectProfileByUsername,
				disconnectProfileByUsername,
				profilesByID,
				profilesByUsername,
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
