// Ports legacy/components/ArticleReactions.js's reaction-toggle behavior
// (legacy/components/ReactionButton/index.js's click handling, minus the
// floating-emoji flourish — no animation per the no-styling constraint) into
// a `<article-reactions>` custom element that talks to `atproto-client.js`
// (Task 20) and `lib/atproto-reactions.js`/`lib/constellation.js` (Task 22)
// instead of legacy's `helpers/API.js` (which hit a Next.js API route/
// Supabase; there is no server here — everything below is a direct write to
// the signed-in user's own PDS, or a public Constellation read).
//
// Degraded state (IMPORTANT): today NO article carries an `atUri` yet —
// Sequoia injects `<link rel="site.standard.document">` at deploy time (Task
// 29), and no content entry has `atUri` in frontmatter either. When no atUri
// is resolvable at all, this element still renders all 6 reaction buttons
// (so the layout is stable once atUri starts showing up) but disables them
// (`button.disabled = true`) and skips count-loading and auth-state
// wiring entirely — clicking does nothing, no network calls are made. This
// is expected/correct, not a bug.
//
// Toggle model: unlike legacy (which let a signed-in user stack up to 20
// reactions of the same type, tracked as a per-user counter), the atproto
// data model here is one `codes.trezy.reaction` record per (user, article,
// type) — so this is a straight toggle: react once (create the record) /
// un-react (delete it), matching the Task 23 brief.

import { getAgent, getState, init } from './atproto-client.js'
import {
	createReaction,
	deleteReaction,
	listUserReactions,
	REACTION_TYPES,
} from '../../lib/atproto-reactions.js'
import { countReactions } from '../../lib/constellation.js'

const SESSION_EVENT = 'atproto:session'
const LOGIN_REQUEST_EVENT = 'atproto:login-request'
const PENDING_KEY = 'pendingAtprotoReaction'

class ArticleReactions extends HTMLElement {
	connectedCallback() {
		this.slug = this.dataset.slug || null

		// atUri source, per Task 23 brief: the `<link rel="site.standard.document">`
		// (Sequoia-injected at deploy time) wins; `data-at-uri` is the fallback
		// (useful for local preview of an entry that already has `atUri` in
		// frontmatter, before Sequoia's inject step has run).
		this.atUri = document.querySelector('link[rel="site.standard.document"]')?.getAttribute('href')
			|| this.dataset.atUri
			|| null

		// Optional seed for the article record's cid, so `resolveAtCid()` can
		// skip the network round-trip if the frontmatter already carries it.
		// Resolved lazily (and cached) otherwise — see `resolveAtCid()`.
		this.atCid = this.dataset.atCid || null

		this.buttonsByType = new Map()
		for (const button of this.querySelectorAll('[data-role="reaction-button"]')) {
			const type = button.dataset.reactionType
			if (!REACTION_TYPES.includes(type)) continue

			this.buttonsByType.set(type, {
				button,
				countEl: button.querySelector('[data-role="reaction-count"]'),
			})
		}

		this.devtoLink = this.querySelector('[data-role="crosspost-devto"]')
		this.hashnodeLink = this.querySelector('[data-role="crosspost-hashnode"]')

		// type -> rkey, for reactions the signed-in user has made on this
		// article. Populated by `syncUserReactions()`, consulted by
		// `toggleReaction()` to decide create vs. delete.
		this.userReactionRkeys = new Map()

		this._onButtonClick = (event) => this.handleClick(event)
		this._onSession = (event) => this.handleSession(event.detail)

		for (const { button } of this.buttonsByType.values()) {
			button.addEventListener('click', this._onButtonClick)
		}
		document.addEventListener(SESSION_EVENT, this._onSession)

		this.renderCrossPostCounts()

		if (!this.atUri) {
			// Degraded state — see file-header note. Disable reacting, skip
			// count-loading and auth wiring entirely.
			for (const { button } of this.buttonsByType.values()) {
				button.disabled = true
			}
			return
		}

		this.loadCounts()

		// Pick up whatever auth state is already known synchronously (e.g.
		// `<atproto-login>` already called `init()`), then react to subsequent
		// changes via the `atproto:session` listener registered above. Also
		// call `init()` ourselves — it's memoized/idempotent (safe to call from
		// multiple islands, see atproto-client.js) — so this element doesn't
		// depend on another island happening to run first.
		this.handleSession(getState())
		init().then((state) => this.handleSession(state))
	}

	disconnectedCallback() {
		for (const { button } of this.buttonsByType.values()) {
			button.removeEventListener('click', this._onButtonClick)
		}
		document.removeEventListener(SESSION_EVENT, this._onSession)
	}

	/** Dev.to/Hashnode cross-post counts, read from `data-devto-*`/`data-hashnode-*`. Resilient: just hides the link if the count is falsy/missing. */
	renderCrossPostCounts() {
		this.renderCrossPostLink(this.devtoLink, this.dataset.devtoUrl, this.dataset.devtoReactions)
		this.renderCrossPostLink(this.hashnodeLink, this.dataset.hashnodeUrl, this.dataset.hashnodeReactions)
	}

	renderCrossPostLink(link, url, reactions) {
		if (!link) return

		const count = Number(reactions) || 0

		if (!url || count <= 0) {
			link.hidden = true
			return
		}

		link.href = url
		const countEl = link.querySelector('[data-role="crosspost-count"]')
		if (countEl) countEl.textContent = String(count)
		link.hidden = false
	}

	/** Fetch aggregate per-type counts via Constellation and render them. Resilient to failure (leaves counts at their static default). */
	async loadCounts() {
		try {
			const counts = await countReactions(this.atUri)
			for (const type of this.buttonsByType.keys()) {
				this.setCount(type, counts[type] || 0)
			}
		} catch (error) {
			console.error('[Reactions] Failed to load reaction counts:', error)
		}
	}

	setCount(type, count) {
		const entry = this.buttonsByType.get(type)
		if (!entry?.countEl) return
		entry.countEl.textContent = String(count)
		entry.countEl.hidden = count === 0
	}

	getCount(type) {
		return Number(this.buttonsByType.get(type)?.countEl.textContent) || 0
	}

	setActive(type, isActive) {
		const entry = this.buttonsByType.get(type)
		if (!entry) return
		entry.button.classList.toggle('is-active', isActive)
		entry.button.setAttribute('aria-pressed', String(isActive))
	}

	/** React to `atproto:session` changes: refresh which of this article's reactions belong to the signed-in user (or clear that state on sign-out), then attempt any reaction the user queued before logging in. */
	async handleSession(state) {
		if (!this.atUri || state.isLoading) return

		if (!state.isAuthenticated) {
			this.userReactionRkeys.clear()
			for (const type of this.buttonsByType.keys()) this.setActive(type, false)
			return
		}

		await this.syncUserReactions()
		this.resumePendingReaction()
	}

	async syncUserReactions() {
		const agent = getAgent()
		if (!agent) return

		try {
			const records = await listUserReactions(agent, this.atUri)

			this.userReactionRkeys.clear()
			for (const record of records) {
				const type = record?.value?.type
				if (!REACTION_TYPES.includes(type)) continue
				// `record.uri` is `at://<did>/codes.trezy.reaction/<rkey>` — the
				// rkey is the last path segment.
				this.userReactionRkeys.set(type, record.uri.split('/').pop())
			}

			for (const type of this.buttonsByType.keys()) {
				this.setActive(type, this.userReactionRkeys.has(type))
			}
		} catch (error) {
			console.error('[Reactions] Failed to load the signed-in user’s reactions:', error)
		}
	}

	/** Resume a reaction the visitor started before being prompted to log in (see `handleClick()`), if it matches this article. Mirrors legacy's post-OAuth-redirect `sessionStorage.pendingAtprotoReaction` handling. */
	resumePendingReaction() {
		const raw = sessionStorage.getItem(PENDING_KEY)
		if (!raw) return

		let pending
		try {
			pending = JSON.parse(raw)
		} catch {
			sessionStorage.removeItem(PENDING_KEY)
			return
		}

		if (!pending || pending.articleSlug !== this.slug || !REACTION_TYPES.includes(pending.type)) return

		sessionStorage.removeItem(PENDING_KEY)
		this.toggleReaction(pending.type)
	}

	handleClick(event) {
		const button = event.currentTarget
		const type = button.dataset.reactionType

		if (!REACTION_TYPES.includes(type) || !this.atUri || button.disabled) return

		if (!getState().isAuthenticated) {
			sessionStorage.setItem(PENDING_KEY, JSON.stringify({ articleSlug: this.slug, type }))
			document.dispatchEvent(new CustomEvent(LOGIN_REQUEST_EVENT))
			return
		}

		this.toggleReaction(type)
	}

	/** Resolve (and cache) the article record's cid, needed by `createReaction()`. Parses `at://<did>/<collection>/<rkey>` and fetches the record directly. */
	async resolveAtCid() {
		if (this.atCid) return this.atCid

		const agent = getAgent()
		if (!agent) throw new Error('[Reactions] Cannot resolve atCid: not authenticated')

		const match = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(this.atUri || '')
		if (!match) throw new Error(`[Reactions] Unrecognized atUri: ${this.atUri}`)

		const [, repo, collection, rkey] = match
		const response = await agent.com.atproto.repo.getRecord({ repo, collection, rkey })

		this.atCid = response.data.cid
		return this.atCid
	}

	/** Optimistic create/delete toggle for `type`. Re-syncs (rolls back the optimistic UI update) on failure. */
	async toggleReaction(type) {
		const agent = getAgent()
		if (!agent) return

		const existingRkey = this.userReactionRkeys.get(type)

		if (existingRkey) {
			this.userReactionRkeys.delete(type)
			this.setActive(type, false)
			this.setCount(type, Math.max(this.getCount(type) - 1, 0))

			try {
				await deleteReaction(agent, existingRkey)
			} catch (error) {
				console.error('[Reactions] Failed to remove reaction:', error)
				this.userReactionRkeys.set(type, existingRkey)
				this.setActive(type, true)
				this.setCount(type, this.getCount(type) + 1)
			}

			return
		}

		this.setActive(type, true)
		this.setCount(type, this.getCount(type) + 1)

		try {
			const atCid = await this.resolveAtCid()
			const { rkey } = await createReaction(agent, this.atUri, atCid, type)
			this.userReactionRkeys.set(type, rkey)
		} catch (error) {
			console.error('[Reactions] Failed to add reaction:', error)
			this.setActive(type, false)
			this.setCount(type, Math.max(this.getCount(type) - 1, 0))
		}
	}
}

customElements.define('article-reactions', ArticleReactions)
