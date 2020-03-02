// Module imports
import React, {
  createRef,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
// import numeral from 'numeral'





// Local imports
import PageWrapper from '../components/PageWrapper'





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

  useEffect(() => {
    const thanksContainer = thanksContainerRef.current
    let intervalID = null

    intervalID = setInterval(() => {
      const newThankYou = document.createElement('li')
      newThankYou.innerHTML = 'thank you'
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
      description=""
      title="Thank You!">
      <section>
        <h2>
          {'Thank you'}{`${thanksTo ? `, ${thanksTo}` : ''}`}{'!'}<br />
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
