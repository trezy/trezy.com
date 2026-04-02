'use client'

// Module imports
import {
	createRef,
	useEffect,
} from 'react'
import { useSearchParams } from 'next/navigation'
import CountUp from 'react-countup'

// Local imports
import { PageContent } from 'components/PageContent.js'

// Local constants
const BASE_DURATION = 0.5
const BASE_THANKS_COUNT = 1000000
const FADE_IN_DIRECTIONS = ['bottom', 'left', 'right', 'top']
const THANKS_DURATION_DIVISOR = 100000
const THANKS_UPDATE_DELAY = 500
const getFadeInDirection = () => FADE_IN_DIRECTIONS[Math.floor(Math.random() * FADE_IN_DIRECTIONS.length)]

export function ThankYouContent() {
	const searchParams = useSearchParams()
	const thanksCount = Number(searchParams.get('thanksCount')) || BASE_THANKS_COUNT
	const thanksTo = searchParams.get('thanksTo')
	const thanksContainerRef = createRef(null)
	const pageTitle = (() => {
		let string = '❤️ Thank you'
		if (thanksTo) {
			string += `, ${thanksTo}`
		}
		return `${string}!`
	})()

	useEffect(() => {
		const thanksContainer = thanksContainerRef.current
		let intervalID = null

		intervalID = setInterval(() => {
			const newThankYou = document.createElement('li')
			newThankYou.innerHTML = `thank you${(Math.random() > 0.5) ? ' ❤️' : ''}`
			newThankYou.setAttribute('data-animate', 'true')
			newThankYou.setAttribute('data-animation', `fade-in-from-${getFadeInDirection()}-small`)
			newThankYou.setAttribute('data-animation-duration', `${BASE_DURATION}s`)
			thanksContainer.appendChild(newThankYou)

			if (thanksContainer.children.length > thanksCount) {
				clearInterval(intervalID)
			}
		}, THANKS_UPDATE_DELAY)

		return () => clearInterval(intervalID)
	}, [])

	return (
		<PageContent title={pageTitle}>
			<section>
				<h2>
					{pageTitle}<br />
					<CountUp
						duration={thanksCount / THANKS_DURATION_DIVISOR}
						end={thanksCount}
						separator="," />
					{' times, thank you!'}
				</h2>
			</section>

			<section>
				<ul
					className="comma-separated"
					ref={thanksContainerRef} />
			</section>
		</PageContent>
	)
}
