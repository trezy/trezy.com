// Module imports
import React, {
	createRef,
	useEffect,
} from 'react'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
import numeral from 'numeral'





// Local imports
import PageWrapper from 'components/PageWrapper'





// Local constants
const BASE_DURATION = 0.5
const BASE_THANKS_COUNT = 1000000
const FADE_IN_DIRECTIONS = ['bottom', 'left', 'right', 'top']
const THANKS_DURATION_DIVISOR = 100000
const THANKS_UPDATE_DELAY = 500
const getFadeInDirection = () => FADE_IN_DIRECTIONS[Math.floor(Math.random() * FADE_IN_DIRECTIONS.length)]





const ThankYou = () => {
	const {
		thanksCount = BASE_THANKS_COUNT,
		thanksTo,
	} = useRouter().query
	const thanksContainerRef = createRef(null)
	const pageDescription = (() => {
		let string = `I offer precisely ${numeral(thanksCount).format('0,0')} thanks`
		if (thanksTo) {
			string += ` to ${thanksTo}`
		}
		return `${string}!`
	})()
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
			/* eslint-disable-next-line no-magic-numbers */
			newThankYou.innerHTML = `thank you${(Math.random() > 0.5) ? ' ❤️' : ''}`
			newThankYou.setAttribute('data-animate', 'true')
			newThankYou.setAttribute('data-animation', `fade-in-from-${getFadeInDirection()}-small`)
			newThankYou.setAttribute('data-animation-duration', `${BASE_DURATION}s`)
			thanksContainer.appendChild(newThankYou)

			if (thanksContainer.children.length > thanksCount) {
				clearInterval(intervalID)
			}
		}, THANKS_UPDATE_DELAY)
	}, [])

	return (
		<PageWrapper
			description={pageDescription}
			title={pageTitle}>
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
		</PageWrapper>
	)
}





export default ThankYou
