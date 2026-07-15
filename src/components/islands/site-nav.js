const BREAKPOINT = 1300

class SiteNav extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('.banner-toggle')
    this.panel = this.querySelector('#site-nav-panel')

    this._onToggleClick = () => this.setOpen(!this.isOpen)
    this._onKeydown = (e) => {
      if (e.key === 'Escape' && this.isTogglable && this.isOpen) this.setOpen(false)
    }
    this._onDocClick = (e) => {
      if (this.isTogglable && this.isOpen && !this.contains(e.target)) this.setOpen(false)
    }
    this._onMqChange = () => this.applyMode()

    this.toggle?.addEventListener('click', this._onToggleClick)
    document.addEventListener('keydown', this._onKeydown)
    document.addEventListener('click', this._onDocClick)

    this.mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`)
    this.mq.addEventListener('change', this._onMqChange)
    this.applyMode()
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('click', this._onToggleClick)
    document.removeEventListener('keydown', this._onKeydown)
    document.removeEventListener('click', this._onDocClick)
    this.mq?.removeEventListener('change', this._onMqChange)
  }

  get isTogglable() { return this.mq.matches }

  get isOpen() { return this.getAttribute('data-open') === 'true' }

  setOpen(v) {
    this.setAttribute('data-open', String(v))
    this.toggle?.setAttribute('aria-expanded', String(v))
  }

  applyMode() { this.setOpen(!this.isTogglable) } // open on desktop, closed on mobile
}

customElements.define('site-nav', SiteNav)
