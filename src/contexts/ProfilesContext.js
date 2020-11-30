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
// import { useAsync } from 'hooks/useAsync'




const ProfilesContext = React.createContext({
	addProfile: () => {},
	connectProfileByUsername: () => {},
	disconnectProfileByUsername: () => {},
	profiles: null,
	profilesByID: {},
	profilesByUsername: {},
})





const ProfilesContextProvider = props => {
	const { children } = props
	const {
		current: collection,
	} = useRef(firestore?.collection('profiles'))
	const connections = useRef({})
	const [profiles, setProfiles] = useState(null)
	const [profilesByID, setProfilesByID] = useState({})
	const [profilesByUsername, setProfilesByUsername] = useState({})

	const handleSnapshot = useCallback(snapshot => {
		setProfilesByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setProfilesByUsername(updateStateObjectFromSnapshot(snapshot, 'username'))
	}, [
		setProfiles,
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
			.where('username', '==', username)
			.onSnapshot(handleSnapshot)
	}, [handleSnapshot])

	const disconnectProfileByUsername = useCallback(username => {
		connections.current[`username:${username}`]()
	}, [])

	return (
		<ProfilesContext.Provider
			value={{
				addProfile,
				connectProfileByUsername,
				disconnectProfileByUsername,
				profiles,
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
