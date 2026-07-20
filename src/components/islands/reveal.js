// Scroll-reveal for `[data-animate]` elements (uses / about pages).
// Enhancement-only: without this script the CSS leaves everything visible.
// Adds `.js-anim` so the reveal CSS engages, then reveals elements as they
// enter the viewport, staggering each intersecting batch.
//
// Two safety nets so content is NEVER left blank (the classic reveal footgun):
//   1. `threshold: 0` — any pixel entering triggers the reveal (large section
//      containers never get "stuck" below a ratio threshold).
//   2. A timeout failsafe reveals anything still hidden, covering odd cases
//      (bfcache restores, layout races, observers that never fire).
// Reduced-motion short-circuits to "reveal everything immediately".
const els = [...document.querySelectorAll('[data-animate]')]

if (els.length) {
  document.documentElement.classList.add('js-anim')

  // `will-change` is a standing promise to the compositor — it costs memory for
  // as long as it's set. The CSS arms it for every `[data-animate]`; release it
  // once an element has actually settled (47 of them on /uses).
  const settle = (el) => { el.style.willChange = 'auto' }

  // Authored timing (`data-animation-delay` / `-duration`) is honoured ONLY
  // inside a `[data-animate-sequence]` group: a choreographed, above-the-fold
  // moment that plays as one batch. Everywhere else the batch stagger wins —
  // /uses authors a cumulative page-load cascade reaching 9.8s, which made
  // sense when everything animated on load but is nonsense once reveals are
  // scroll-triggered (an element scrolled into view would sit blank for ten
  // seconds). Those attributes stay inert there, exactly as before.
  const reveal = (el, i = 0) => {
    if (el.closest('[data-animate-sequence]')) {
      const { animationDelay, animationDuration } = el.dataset
      if (animationDelay) el.style.transitionDelay = animationDelay
      if (animationDuration) el.style.transitionDuration = animationDuration
    } else {
      el.style.transitionDelay = `${i * 45}ms`
    }
    el.addEventListener('transitionend', () => settle(el), { once: true })
    el.classList.add('in-view')
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    // No inline timing at all: the authored delays would otherwise out-specify
    // the collapsed duration tokens and reintroduce the wait we're removing.
    els.forEach((el) => {
      el.classList.add('in-view')
      settle(el)
    })
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            reveal(entry.target, i)
            obs.unobserve(entry.target)
          })
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0 },
    )

    els.forEach((el) => io.observe(el))

    // Failsafe: never leave anything hidden.
    setTimeout(() => {
      els.forEach((el) => {
        if (!el.classList.contains('in-view')) {
          el.classList.add('in-view')
          settle(el)
        }
      })
    }, 1600)
  }
}
