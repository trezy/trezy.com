// Ports legacy/app/atproto/callback/page.js. Legacy waited (via a `useEffect`
// keyed on `isLoading`) for `contexts/ATProtoContext.js`'s session-restore
// effect to finish, then read `sessionStorage.pendingAtprotoReaction` (set by
// `ArticleReactions`'s `onLoginStart` right before redirecting to the PDS,
// see legacy/components/ArticleReactions.js:190-202) to decide where to send
// the user back to, defaulting to `/`.
//
// Here there's no framework effect to key off of: `handleCallback()` (an
// alias for atproto-client.js's `init()`) already awaits the whole
// restore-or-complete-OAuth-code flow before resolving, so we just await it
// directly and then redirect. `init()`/`handleCallback()` never rejects (it
// catches its own errors internally and still resolves), but the try/catch
// below is kept as a defensive belt-and-suspenders in case that changes.
//
// NOTE: this intentionally does NOT clear `pendingAtprotoReaction` from
// sessionStorage — Task 23's reactions island reads and clears it itself
// once it re-mounts on the redirected-to article page and replays the
// pending reaction, mirroring legacy's `ArticleReactions` effect.

import { handleCallback } from './atproto-client.js'

const PENDING_REACTION_KEY = 'pendingAtprotoReaction'

/** Where to send the user back to after login, mirroring legacy's redirect logic. */
function resolveRedirectPath() {
	let pending = null

	try {
		pending = sessionStorage.getItem(PENDING_REACTION_KEY)
	} catch (error) {
		// sessionStorage may be unavailable (e.g. privacy mode); fall through to '/'
		return '/'
	}

	if (!pending) return '/'

	try {
		const { articleSlug } = JSON.parse(pending)

		if (articleSlug) return `/blog/${articleSlug}`
	} catch (error) {
		// ignore parse errors, fall through to default
	}

	return '/'
}

async function completeLogin() {
	try {
		await handleCallback()
	} catch (error) {
		console.error('[ATProto] Failed to complete OAuth callback:', error)
	}

	window.location.replace(resolveRedirectPath())
}

completeLogin()
