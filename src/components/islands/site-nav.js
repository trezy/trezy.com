const BREAKPOINT = 1300

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

class SiteNav extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('.banner-toggle')
    this.drawer = this.querySelector('.banner-panel')
    this.panel = this.querySelector('#site-nav-panel')
    // Everything the mobile drawer overlays — hidden from AT + pointer while open.
    this.outside = [...document.querySelectorAll('main, footer[role="contentinfo"]')]

    this._onToggleClick = () => this.setOpen(!this.isOpen)
    this._onKeydown = (e) => {
      if (!this.isTogglable || !this.isOpen) return
      if (e.key === 'Escape') this.setOpen(false)
      else if (e.key === 'Tab') this.trapFocus(e)
    }
    this._onDocClick = (e) => {
      if (this.isTogglable && this.isOpen && !this.contains(e.target)) this.setOpen(false)
    }
    this._onMqChange = () => this.applyMode()
    this._onNavClick = (e) => {
      if (e.target.closest('[data-nav-close]')) this.setOpen(false)
    }

    this.toggle?.addEventListener('click', this._onToggleClick)
    this.addEventListener('click', this._onNavClick)
    document.addEventListener('keydown', this._onKeydown)
    document.addEventListener('click', this._onDocClick)

    this.mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`)
    this.mq.addEventListener('change', this._onMqChange)
    this.applyMode()
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('click', this._onToggleClick)
    this.removeEventListener('click', this._onNavClick)
    document.removeEventListener('keydown', this._onKeydown)
    document.removeEventListener('click', this._onDocClick)
    this.mq?.removeEventListener('change', this._onMqChange)
    // Never leave the rest of the page inert / scroll-locked if we're torn down mid-open.
    this.setOutsideInert(false)
    document.documentElement.classList.remove('nav-scroll-lock')
  }

  get isTogglable() { return this.mq.matches }

  get isOpen() { return this.getAttribute('data-open') === 'true' }

  get focusable() {
    return [...this.drawer.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
  }

  // Keep Tab inside the open drawer (it's a modal on mobile).
  trapFocus(e) {
    const items = this.focusable
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (!this.drawer.contains(active)) {
      e.preventDefault()
      first.focus()
    } else if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  setOutsideInert(v) {
    this.outside.forEach((el) => { el.inert = v })
  }

  setOpen(v) {
    const wasOpen = this.isOpen
    this.setAttribute('data-open', String(v))
    this.toggle?.setAttribute('aria-expanded', String(v))

    if (this.isTogglable) {
      // Mobile: the drawer is a real modal. Trap focus, hide the rest of the
      // page from AT/pointer, lock body scroll, and keep the closed (off-screen)
      // panel out of the tab order entirely.
      this.drawer.inert = !v
      this.drawer.setAttribute('aria-modal', String(v))
      this.setOutsideInert(v)
      document.documentElement.classList.toggle('nav-scroll-lock', v)
      if (v && !wasOpen) {
        this.focusable[0]?.focus() // the in-drawer close button
      } else if (!v && wasOpen) {
        // The opener was display:none while open; flush layout so it's
        // focusable again before returning focus to it.
        void this.toggle?.offsetWidth
        this.toggle?.focus()
      }
    } else {
      // Desktop rail: always present and interactive; never inert or scroll-locking.
      this.drawer.inert = false
      this.setOutsideInert(false)
      document.documentElement.classList.remove('nav-scroll-lock')
    }
  }

  applyMode() {
    // In drawer mode the panel is a modal dialog; on the desktop rail it's just
    // a persistent navigation container.
    if (this.isTogglable) {
      this.drawer.setAttribute('role', 'dialog')
      this.drawer.setAttribute('aria-label', 'Site navigation')
    } else {
      this.drawer.removeAttribute('role')
      this.drawer.removeAttribute('aria-modal')
      this.drawer.removeAttribute('aria-label')
    }
    this.setOpen(!this.isTogglable) // open on desktop, closed on mobile
  }
}

customElements.define('site-nav', SiteNav)
