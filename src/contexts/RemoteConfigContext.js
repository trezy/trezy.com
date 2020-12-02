// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { useAuth } from 'contexts/AuthContext'
import { useFirebase } from 'hooks/useFirebase'





// Local constants
const REMOTE_CONFIG_MAP = [
	{
		key: 'isNotificationsSettingsEnabled',
		type: Boolean,
	},
	{
		key: 'isStoreEnabled',
		type: Boolean,
	},
]
const RemoteConfigContext = React.createContext({
	config: {},
	isLoaded: false,
})





const RemoteConfigContextProvider = props => {
	const { children } = props
	const {
		isLoaded: userIsLoaded,
	} = useAuth()
	const { remoteConfig } = useFirebase()
	const [config, setConfig] = useState({})
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(async () => {
		if (userIsLoaded && remoteConfig) {
			await remoteConfig.fetchAndActivate()

			const compiledConfig = REMOTE_CONFIG_MAP.reduce((accumulator, {key, type}) => ({
				...accumulator,
				[key]: remoteConfig[`get${type.name}`](),
			}), {})

			setConfig(compiledConfig)
			setIsLoaded(true)
		}
	}, [
		setConfig,
		setIsLoaded,
		userIsLoaded,
	])

	return (
		<RemoteConfigContext.Provider
			value={{
				config,
				isLoaded,
			}}>
			{children}
		</RemoteConfigContext.Provider>
	)
}

RemoteConfigContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useRemoteConfig = () => useContext(RemoteConfigContext)





export {
	RemoteConfigContext,
	RemoteConfigContextProvider,
	useRemoteConfig,
}
