import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'


const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
const IS_DEV = PUBLIC_URL.startsWith('http://')

export const ATProtoContext = createContext({
	agent: null,
	did: null,
	handle: null,
	isAuthenticated: false,
	isLoading: true,
	login: () => {},
	logout: () => {},
})




export function ATProtoContextProvider(props) {
	const { children } = props

	const [oauthClient, setOauthClient] = useState(null)
	const [session, setSession] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		async function initClient() {
			try {
				const { BrowserOAuthClient } = await import('@atproto/oauth-client-browser')

				const redirectUri = `${PUBLIC_URL}/atproto/callback`

				let client

				if (IS_DEV) {
					const clientId = `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=atproto%20transition:generic`
					client = await BrowserOAuthClient.load({
						clientId,
						handleResolver: 'https://bsky.social',
					})
				} else {
					client = new BrowserOAuthClient({
						clientMetadata: {
							client_id: `${PUBLIC_URL}/api/atproto/client-metadata.json`,
							client_name: 'trezy.codes',
							client_uri: PUBLIC_URL,
							logo_uri: `${PUBLIC_URL}/favicon/android-chrome-512x512.png`,
							redirect_uris: [redirectUri],
							grant_types: ['authorization_code', 'refresh_token'],
							response_types: ['code'],
							scope: 'atproto repo:codes.trezy.reaction?action=create repo:codes.trezy.reaction?action=delete',
							token_endpoint_auth_method: 'none',
							application_type: 'web',
							dpop_bound_access_tokens: true,
						},
						handleResolver: 'https://bsky.social',
					})
				}

				const result = await client.init()

				if (cancelled) return

				setOauthClient(client)

				if (result?.session) {
					setSession(result.session)
				}
			} catch (error) {
				console.error('[ATProto] Failed to initialize OAuth client:', error)
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		initClient()

		return () => {
			cancelled = true
		}
	}, [])

	const [agent, setAgent] = useState(null)

	useEffect(() => {
		if (!session) {
			setAgent(null)
			return
		}

		import('@atproto/api').then(({ Agent }) => {
			setAgent(new Agent(session))
		})
	}, [session])

	const did = session?.did ?? null
	const handle = session?.handle ?? null
	const isAuthenticated = Boolean(session)

	const login = useCallback(async (handle) => {
		if (!oauthClient) {
			throw new Error('OAuth client not initialized')
		}

		try {
			await oauthClient.signIn(handle)
		} catch (error) {
			console.error('[ATProto] Login failed:', error)
			throw error
		}
	}, [oauthClient])

	const logout = useCallback(async () => {
		if (session) {
			try {
				await session.signOut()
			} catch (error) {
				console.error('[ATProto] Logout failed:', error)
			}
			setSession(null)
		}
	}, [session])

	return (
		<ATProtoContext.Provider
			value={{
				agent,
				did,
				handle,
				isAuthenticated,
				isLoading,
				login,
				logout,
			}}>
			{children}
		</ATProtoContext.Provider>
	)
}

ATProtoContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export const useATProto = () => useContext(ATProtoContext)
