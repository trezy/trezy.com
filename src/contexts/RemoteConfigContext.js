// Module imports
import {
	createContext,
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
export const RemoteConfigContext = createContext({
	isLoaded: false,
	config: null,
})





export function RemoteConfigContextProvider(props) {
	const { children } = props
	const {
		isLoaded: userIsLoaded,
		user,
	} = useAuth()
	const { remoteConfig } = useFirebase()
	const [config, setRemoteConfig] = useState(null)
	const timeoutID = useRef(null)
	const [isLoaded, setIsLoaded] = useState(false)

	const updateConfig = useCallback(async () => {
		await remoteConfig.fetchAndActivate()

		const compiledConfig = REMOTE_CONFIG_MAP.reduce((accumulator, {key, type}) => ({
			...accumulator,
			[key]: remoteConfig[`get${type.name}`](key),
		}), {})

		setRemoteConfig(compiledConfig)
	}, [setRemoteConfig])

	const initializeRemoteConfig = useCallback(async () => {
		if (!remoteConfig) {
			return timeoutID.current = setTimeout(() => initializeRemoteConfig(), 100)
		}

		remoteConfig.settings.minimumFetchIntervalMillis = 1000

		await updateConfig()

		setIsLoaded(true)
	}, [
		setIsLoaded,
		updateConfig,
	])

	useEffect(initializeRemoteConfig, [])

	useEffect(() => {
		if (remoteConfig && isLoaded) {
			updateConfig()
		}
	}, [
		isLoaded,
		user,
	])

	return (
		<RemoteConfigContext.Provider
			value={{
				isLoaded,
				config,
			}}>
			{children}
		</RemoteConfigContext.Provider>
	)
}

RemoteConfigContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export const useRemoteConfig = () => useContext(RemoteConfigContext)
