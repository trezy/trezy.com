// Ports legacy/components/ATProtoLoginModal/index.js (a React modal driven by
// `contexts/ATProtoContext.js`) into a `<atproto-login>` custom element that
// talks to the vanilla `atproto-client.js` singleton (Task 20) instead of a
// React context.
//
// Unlike legacy (where the modal only existed in the DOM while
// `ArticleReactions` had `showLoginModal` set), this element is always
// present on article pages and toggles two states in place:
//   - unauthenticated: a small "Log in with Atmosphere" trigger, which opens
//     a `<dialog>` containing the handle-input form (the ported modal).
//   - authenticated: the resolved identity (handle, falling back to DID) and
//     a "Log out" button.
//
// It also listens for a document-level `atproto:login-request` event
// (dispatched by Task 23's reactions island when a signed-out visitor tries
// to react) and opens the dialog on demand — this replaces legacy's
// `onLoginStart`/`setShowLoginModal(true)` wiring.
//
// `getState().handle` is always `null` for an OAuth session (`OAuthSession`
// has no `.handle`), so the display handle is resolved once per DID via
// `agent.getProfile({ actor: did })`, falling back to the raw DID if that
// fetch fails.

import {
	getAgent,
	getState,
	init,
	login,
	logout,
} from './atproto-client.js'

const SESSION_EVENT = 'atproto:session'
const LOGIN_REQUEST_EVENT = 'atproto:login-request'

class AtprotoLogin extends HTMLElement {
	connectedCallback() {
		this.triggerButton = this.querySelector('[data-role="atproto-login-trigger"]')
		this.identityText = this.querySelector('[data-role="atproto-identity"]')
		this.identityName = this.querySelector('[data-role="atproto-identity-name"]')
		this.logoutButton = this.querySelector('[data-role="atproto-logout"]')
		this.dialog = this.querySelector('[data-role="atproto-login-dialog"]')
		this.form = this.querySelector('[data-role="atproto-login-form"]')
		this.handleInput = this.querySelector('[data-role="atproto-handle-input"]')
		this.errorText = this.querySelector('[data-role="atproto-login-error"]')
		this.submitButton = this.querySelector('[data-role="atproto-login-submit"]')
		this.cancelButton = this.querySelector('[data-role="atproto-login-cancel"]')
		this.infoToggle = this.querySelector('[data-role="atproto-info-toggle"]')
		this.infoText = this.querySelector('[data-role="atproto-info-text"]')

		// DID whose handle has already been resolved (or attempted), so
		// `render()` doesn't re-fetch the profile on every `atproto:session`
		// event while signed in.
		this._resolvedDid = null

		this._onTriggerClick = () => this.openDialog()
		this._onCancelClick = () => this.closeDialog()
		this._onFormSubmit = (event) => this.handleSubmit(event)
		this._onLogoutClick = () => this.handleLogout()
		this._onInfoToggle = () => this.toggleInfo()
		this._onSession = (event) => this.render(event.detail)
		this._onLoginRequest = () => this.handleLoginRequest()
		this._onDialogClick = (event) => {
			if (event.target === this.dialog) this.closeDialog()
		}
		this._onDialogCancel = (event) => {
			// native <dialog> "cancel" event (e.g. Esc key) — let it close
			// normally, just reset the error state.
			if (this.errorText) this.errorText.hidden = true
		}

		this.triggerButton?.addEventListener('click', this._onTriggerClick)
		this.cancelButton?.addEventListener('click', this._onCancelClick)
		this.form?.addEventListener('submit', this._onFormSubmit)
		this.logoutButton?.addEventListener('click', this._onLogoutClick)
		this.infoToggle?.addEventListener('click', this._onInfoToggle)
		this.dialog?.addEventListener('click', this._onDialogClick)
		this.dialog?.addEventListener('cancel', this._onDialogCancel)
		document.addEventListener(SESSION_EVENT, this._onSession)
		document.addEventListener(LOGIN_REQUEST_EVENT, this._onLoginRequest)

		// Render whatever state is already known synchronously (e.g. another
		// island already called `init()`), then again once this element's own
		// `init()` call resolves.
		this.render(getState())
		init().then((state) => this.render(state))
	}

	disconnectedCallback() {
		this.triggerButton?.removeEventListener('click', this._onTriggerClick)
		this.cancelButton?.removeEventListener('click', this._onCancelClick)
		this.form?.removeEventListener('submit', this._onFormSubmit)
		this.logoutButton?.removeEventListener('click', this._onLogoutClick)
		this.infoToggle?.removeEventListener('click', this._onInfoToggle)
		this.dialog?.removeEventListener('click', this._onDialogClick)
		this.dialog?.removeEventListener('cancel', this._onDialogCancel)
		document.removeEventListener(SESSION_EVENT, this._onSession)
		document.removeEventListener(LOGIN_REQUEST_EVENT, this._onLoginRequest)
	}

	/** Handler for the `atproto:login-request` event dispatched by the reactions island (Task 23). */
	handleLoginRequest() {
		if (getState().isAuthenticated) return
		this.openDialog()
	}

	openDialog() {
		if (this.errorText) this.errorText.hidden = true

		if (typeof this.dialog?.showModal === 'function') {
			this.dialog.showModal()
		} else {
			this.dialog?.setAttribute('open', '')
		}

		this.handleInput?.focus()
	}

	closeDialog() {
		if (typeof this.dialog?.close === 'function') {
			this.dialog.close()
		} else {
			this.dialog?.removeAttribute('open')
		}
	}

	toggleInfo() {
		if (!this.infoToggle || !this.infoText) return

		const isOpen = this.infoToggle.getAttribute('aria-expanded') === 'true'

		this.infoToggle.setAttribute('aria-expanded', String(!isOpen))
		this.infoText.hidden = isOpen
	}

	async handleSubmit(event) {
		event.preventDefault()

		const handle = this.handleInput?.value.trim()
		if (!handle) return

		if (this.errorText) this.errorText.hidden = true
		if (this.submitButton) {
			this.submitButton.disabled = true
			this.submitButton.textContent = 'Connecting...'
		}

		try {
			// Redirects the browser to the PDS/authorization server; on
			// success this call never resolves (navigation happens instead).
			await login(handle)
		} catch (error) {
			console.error('[ATProto] Login failed:', error)

			if (this.errorText) {
				this.errorText.textContent = 'Failed to start login. Please check your handle and try again.'
				this.errorText.hidden = false
			}

			if (this.submitButton) {
				this.submitButton.disabled = false
				this.submitButton.textContent = 'Connect'
			}
		}
	}

	async handleLogout() {
		await logout()
	}

	async render(state) {
		const { isAuthenticated, isLoading, did } = state

		if (isLoading) {
			// Avoid a flash of "log in" UI before the restored-session check
			// (or the OAuth callback) has resolved.
			if (this.triggerButton) this.triggerButton.hidden = true
			if (this.identityText) this.identityText.hidden = true
			if (this.logoutButton) this.logoutButton.hidden = true
			return
		}

		if (this.triggerButton) this.triggerButton.hidden = isAuthenticated
		if (this.identityText) this.identityText.hidden = !isAuthenticated
		if (this.logoutButton) this.logoutButton.hidden = !isAuthenticated

		if (!isAuthenticated) {
			this._resolvedDid = null
			this.closeDialog()
			return
		}

		// Login succeeded (or a session was restored) — the dialog, if open,
		// has served its purpose.
		this.closeDialog()

		if (this.identityName) this.identityName.textContent = did

		if (this._resolvedDid === did) return
		this._resolvedDid = did

		try {
			const agent = getAgent()
			const profile = await agent.getProfile({ actor: did })

			// Guard against a logout/relogin racing this fetch.
			if (this.identityName && (getState().did === did)) {
				this.identityName.textContent = profile.data.handle
			}
		} catch (error) {
			console.error('[ATProto] Failed to resolve profile:', error)
			// Fall back to the DID already rendered above.
		}
	}
}

customElements.define('atproto-login', AtprotoLogin)
