// Replaces `next-themes` (see legacy/app/ClientProviders.js, which used
// `<ThemeProvider attribute="data-theme" defaultTheme="system">`).
//
// `<theme-toggle>` cycles through light -> dark -> system on click, persists
// the choice to `localStorage.theme`, and mirrors the effective theme onto
// `document.documentElement.dataset.theme` (resolving `system` via
// `matchMedia`). This mirrors the inline no-flash script in
// `BaseLayout.astro`, which performs the same resolution before first paint.

const THEME_ORDER = ['light', 'dark', 'system']

const LABELS = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

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
    this.icons = this.querySelectorAll('[data-theme-icon]')

    this._onClick = () => this.cycleTheme()
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

  cycleTheme() {
    const currentIndex = THEME_ORDER.indexOf(this.theme)
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length

    this.theme = THEME_ORDER[nextIndex]
    setStoredTheme(this.theme)
    this.applyTheme()
  }

  applyTheme() {
    const effective = resolveEffectiveTheme(this.theme)

    document.documentElement.dataset.theme = effective

    this.button?.setAttribute('aria-label', LABELS[this.theme])
    this.button?.setAttribute('data-theme-preference', this.theme)

    this.icons?.forEach((icon) => {
      icon.hidden = icon.dataset.themeIcon !== this.theme
    })
  }
}

customElements.define('theme-toggle', ThemeToggle)
