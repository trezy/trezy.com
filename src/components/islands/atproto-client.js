// Framework-less singleton AT Protocol OAuth client + session store.
//
// Ports legacy/contexts/ATProtoContext.js (a React context provider) into a
// plain ES module: there's no React tree to hang state on here, so this
// module holds module-scoped state instead of `useState`, and publishes
// changes via a `atproto:session` CustomEvent on `document` in place of
// context re-renders. Any island can
// `document.addEventListener('atproto:session', handler)` to react to
// changes, and can call `getState()` once at mount to pick up state that was
// published before it subscribed (e.g. session restore finishing before the
// login button mounts).
//
// Consumed by:
//  - Task 21 (login UI + `/atproto/callback` page): calls `init()`,
//    `login()`, `logout()`, `handleCallback()`, and listens for
//    `atproto:session`.
//  - Task 23 (reactions): calls `getAgent()` to make authenticated writes.
//
// Dev vs prod client id, mirroring legacy's `initClient()`: legacy derived
// both `PUBLIC_URL` and the dev/prod branch from
// `process.env.NEXT_PUBLIC_URL` (build-time env). There's no equivalent
// build-time value available to a browser-loaded island in the static site,
// so this derives the origin at runtime from `window.location.origin`, and
// treats an `http://` origin as dev (matches legacy in practice: local dev
// always ran on `http://127.0.0.1:3000`/`http://localhost:3000`, prod is
// always `https://trezy.com`).
//
// NOTE on `scope`: legacy's prod `clientMetadata.scope` was
// `'atproto repo:codes.trezy.reaction?action=create repo:codes.trezy.reaction?action=delete'`,
// but legacy's *dev* loopback `clientId` already hardcoded
// `atproto transition:generic` regardless — the two branches disagreed. This
// port standardizes both branches (and the static
// `/api/atproto/client-metadata.json` document, see
// src/pages/api/atproto/client-metadata.json.ts) on `atproto transition:generic`
// per the Task 20 brief, so dev and prod request the same scope and the
// live client and hosted metadata document never drift apart.

const REDIRECT_PATH = '/atproto/callback'
const HANDLE_RESOLVER = 'https://bsky.social'
const SESSION_EVENT = 'atproto:session'

let oauthClient = null
let initPromise = null
let session = null
let agent = null
let isLoading = true

/**
 * Build the `BrowserOAuthClient` clientMetadata for the prod path. Mirrors
 * the static document served at `/api/atproto/client-metadata.json`
 * (src/pages/api/atproto/client-metadata.json.ts) field-for-field.
 */
function buildClientMetadata(origin, redirectUri) {
	return {
		client_id: `${origin}/api/atproto/client-metadata.json`,
		client_name: 'trezy.codes',
		client_uri: origin,
		logo_uri: `${origin}/favicon/android-chrome-512x512.png`,
		redirect_uris: [redirectUri],
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code'],
		scope: 'atproto transition:generic',
		token_endpoint_auth_method: 'none',
		application_type: 'web',
		dpop_bound_access_tokens: true,
	}
}

/**
 * Lazily create (and memoize) the `BrowserOAuthClient` instance.
 *
 * In dev (origin starting with `http://`, i.e. a local, non-TLS dev server)
 * this uses the loopback-client-id flow, so OAuth works without a publicly
 * hosted metadata document. In prod it uses the hosted metadata document at
 * `/api/atproto/client-metadata.json`. Mirrors
 * legacy/contexts/ATProtoContext.js's `initClient()`.
 */
export async function getOAuthClient() {
	if (oauthClient) {
		return oauthClient
	}

	const { BrowserOAuthClient } = await import('@atproto/oauth-client-browser')

	const origin = window.location.origin
	const isDev = origin.startsWith('http://')
	const redirectUri = `${origin}${REDIRECT_PATH}`

	if (isDev) {
		const clientId = `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=atproto%20transition:generic`

		oauthClient = await BrowserOAuthClient.load({
			clientId,
			handleResolver: HANDLE_RESOLVER,
		})
	} else {
		oauthClient = new BrowserOAuthClient({
			clientMetadata: buildClientMetadata(origin, redirectUri),
			handleResolver: HANDLE_RESOLVER,
		})
	}

	return oauthClient
}

/** Publish the current session state as a `atproto:session` CustomEvent on `document`. */
function publish() {
	document.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: getState() }))
}

/**
 * Set the current session (or `null`), lazily instantiate an `Agent` (from
 * `@atproto/api`) bound to it, then publish the change. Mirrors legacy's
 * `session` state + the `useEffect` that derived `agent` from it.
 */
async function setSession(nextSession) {
	session = nextSession

	if (!session) {
		agent = null
	} else {
		const { Agent } = await import('@atproto/api')
		agent = new Agent(session)
	}

	publish()
}

/**
 * Initialize the OAuth client and restore any existing session.
 *
 * This is also what completes the OAuth callback: `BrowserOAuthClient#init()`
 * inspects `location.search` for the `?code=...&state=...` (or `?error=...`)
 * params the authorization server appends on redirect back to
 * `/atproto/callback`, and resolves the session from them when present —
 * there is no separate "exchange the code" step to call.
 *
 * Safe to call more than once (from multiple islands on the same page, or
 * from both a layout-level session-restore call and the callback page): the
 * underlying work only runs once, and every caller shares the same promise.
 */
export function init() {
	if (initPromise) {
		return initPromise
	}

	initPromise = (async () => {
		try {
			const client = await getOAuthClient()
			const result = await client.init()

			if (result?.session) {
				await setSession(result.session)
			} else {
				publish()
			}
		} catch (error) {
			console.error('[ATProto] Failed to initialize OAuth client:', error)
			publish()
		} finally {
			isLoading = false
		}

		return getState()
	})()

	return initPromise
}

/**
 * Complete the OAuth callback. `/atproto/callback` (Task 21) calls this on
 * load. It's a documented alias for `init()` — since `init()` already
 * performs the `client.init()` call that resolves `?code=...` params, calling
 * this is safe whether or not `init()` has already run elsewhere on the page.
 */
export function handleCallback() {
	return init()
}

/** Begin the OAuth sign-in flow for `handle` (redirects the browser to the user's PDS/authorization server). */
export async function login(handle) {
	const client = await getOAuthClient()

	try {
		await client.signIn(handle)
	} catch (error) {
		console.error('[ATProto] Login failed:', error)
		throw error
	}
}

/** Sign out of the current session, if any, and clear local state. */
export async function logout() {
	if (!session) {
		return
	}

	try {
		await session.signOut()
	} catch (error) {
		console.error('[ATProto] Logout failed:', error)
	}

	await setSession(null)
}

/** The current `Agent` (from `@atproto/api`) bound to the session, or `null` if signed out. */
export function getAgent() {
	return agent
}

/** The current raw `OAuthSession`, or `null` if signed out. */
export function getSession() {
	return session
}

/**
 * Synchronous snapshot of session state, for callers that need a value
 * before (or without) subscribing to `atproto:session` — e.g. an island
 * reading state once at `connectedCallback()` time.
 */
export function getState() {
	return {
		did: session?.did ?? null,
		handle: session?.handle ?? null,
		isAuthenticated: Boolean(session),
		isLoading,
	}
}
