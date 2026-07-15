// Ported from legacy/app/thank-you/ThankYouContent.js
//
// Legacy used `useSearchParams` + `react-countup` inside a React tree. Here
// a `<thanks-counter>` custom element reads the same query params directly
// from `location.search`, animates the count itself (rAF-driven, standing
// in for react-countup), and appends "thank you" list items on the same
// interval/fade-in behavior as the legacy `setInterval` effect.

const BASE_DURATION = 0.5
const BASE_THANKS_COUNT = 1000000
const FADE_IN_DIRECTIONS = ['bottom', 'left', 'right', 'top']
const THANKS_DURATION_DIVISOR = 100000
const THANKS_UPDATE_DELAY = 500

function getFadeInDirection() {
	return FADE_IN_DIRECTIONS[Math.floor(Math.random() * FADE_IN_DIRECTIONS.length)]
}

function getThankYouTitle(thanksTo) {
	let string = '❤️ Thank you'

	if (thanksTo) {
		string += `, ${thanksTo}`
	}

	return `${string}!`
}

class ThanksCounter extends HTMLElement {
	intervalID = null
	rafID = null

	connectedCallback() {
		const searchParams = new URLSearchParams(location.search)
		const defaultThanksCount = Number(this.dataset.baseCount) || BASE_THANKS_COUNT
		const thanksCount = Number(searchParams.get('thanksCount')) || defaultThanksCount
		const thanksTo = searchParams.get('thanksTo')

		this.countElement = this.querySelector('[data-role="count"]')
		this.listElement = this.querySelector('[data-role="thanks-list"]')

		const title = getThankYouTitle(thanksTo)
		const pageTitleElement = document.querySelector('[data-role="page-title"]')
		const sectionTitleElement = this.querySelector('[data-role="section-title"]')

		if (pageTitleElement) {
			pageTitleElement.textContent = title
		}

		if (sectionTitleElement) {
			sectionTitleElement.textContent = title
		}

		document.title = document.title.replace(/^[^|]+/u, `${title} `)

		this.animateCount(thanksCount)
		this.startThanksInterval(thanksCount)
	}

	disconnectedCallback() {
		if (this.intervalID) {
			clearInterval(this.intervalID)
			this.intervalID = null
		}

		if (this.rafID) {
			cancelAnimationFrame(this.rafID)
			this.rafID = null
		}
	}

	animateCount(end) {
		if (!this.countElement) {
			return
		}

		const durationInSeconds = end / THANKS_DURATION_DIVISOR
		const durationInMilliseconds = (durationInSeconds > 0 ? durationInSeconds : 1) * 1000
		const formatter = new Intl.NumberFormat('en-US')
		const startTime = performance.now()

		const step = (now) => {
			const elapsed = now - startTime
			const progress = Math.min(elapsed / durationInMilliseconds, 1)
			const value = Math.floor(end * progress)

			this.countElement.textContent = formatter.format(value)

			if (progress < 1) {
				this.rafID = requestAnimationFrame(step)
			} else {
				this.rafID = null
			}
		}

		this.rafID = requestAnimationFrame(step)
	}

	startThanksInterval(thanksCount) {
		if (!this.listElement) {
			return
		}

		this.intervalID = setInterval(() => {
			const newThankYou = document.createElement('li')
			newThankYou.innerHTML = `thank you${(Math.random() > 0.5) ? ' ❤️' : ''}`
			newThankYou.setAttribute('data-animate', 'true')
			newThankYou.setAttribute('data-animation', `fade-in-from-${getFadeInDirection()}-small`)
			newThankYou.setAttribute('data-animation-duration', `${BASE_DURATION}s`)
			this.listElement.appendChild(newThankYou)

			if (this.listElement.children.length > thanksCount) {
				clearInterval(this.intervalID)
				this.intervalID = null
			}
		}, THANKS_UPDATE_DELAY)
	}
}

customElements.define('thanks-counter', ThanksCounter)
