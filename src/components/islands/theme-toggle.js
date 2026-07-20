// Replaces `next-themes` (see legacy/app/ClientProviders.js, which used
// `<ThemeProvider attribute="data-theme" defaultTheme="system">`).
//
// `<theme-toggle>` cycles through light -> dark -> system on click, persists
// the choice to `localStorage.theme`, and mirrors the effective theme onto
// `document.documentElement.dataset.theme` (resolving `system` via
// `matchMedia`). This mirrors the inline no-flash script in
// `BaseLayout.astro`, which performs the same resolution before first paint.

function getStoredTheme() {
  try {
    return localStorage.getItem('theme')
  } catch (err) {
    return null
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch (err) {
    // localStorage may be unavailable (e.g. privacy mode); ignore
  }
}

function resolveEffectiveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return theme
}

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('[data-role="theme-toggle-button"]')

    this._onClick = () => this.toggleTheme()
    this._onMqChange = () => {
      if (this.theme === 'system') {
        this.applyTheme()
      }
    }

    this.button?.addEventListener('click', this._onClick)

    this.mq = window.matchMedia('(prefers-color-scheme: dark)')
    this.mq.addEventListener('change', this._onMqChange)

    this.theme = getStoredTheme() || 'system'
    this.applyTheme()
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this._onClick)
    this.mq?.removeEventListener('change', this._onMqChange)
  }

  // Reversible light <-> dark toggle. The stored default stays "system" (so
  // an untouched visitor still follows their OS), but any click sets an
  // explicit theme, and clicking again always goes back.
  toggleTheme() {
    const effective = resolveEffectiveTheme(this.theme)
    this.theme = effective === 'dark' ? 'light' : 'dark'
    setStoredTheme(this.theme)
    this.applyTheme()
  }

  applyTheme() {
    const effective = resolveEffectiveTheme(this.theme)

    document.documentElement.dataset.theme = effective

    // Label + tooltip describe the ACTION (what the next click does).
    const next = effective === 'dark' ? 'light' : 'dark'
    const label = `Switch to ${next} theme`
    this.button?.setAttribute('aria-label', label)
    this.button?.setAttribute('title', label)
    this.button?.setAttribute('data-theme-preference', this.theme)
    // Icon visibility is driven purely by `[data-theme]` in CSS (flash-free).
  }
}

customElements.define('theme-toggle', ThemeToggle)
