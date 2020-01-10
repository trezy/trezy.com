// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import ExternalLink from '../components/ExternalLink'
import PageWrapper from '../components/PageWrapper'





// Local constants
const CASCADE_DELAY_INCREMENT = 0.2
const BASE_DELAY = 0.6
const BASE_DURATION = 0.5
const linkPropTypes = { children: PropTypes.string.isRequired }

const MacbookProLink = ({ children }) => (
  <ExternalLink href="https://www.apple.com/macbook-pro-13/">
    {children}
  </ExternalLink>
)
MacbookProLink.propTypes = { ...linkPropTypes }

const MagicKeyboardLink = ({ children }) => (
  <ExternalLink href="https://www.apple.com/shop/product/MRMH2LL/A/magic-keyboard-with-numeric-keypad-us-english-space-gray?fnode=4c">
    {children}
  </ExternalLink>
)
MagicKeyboardLink.propTypes = { ...linkPropTypes }

const MagicTrackpadLink = ({ children }) => (
  <ExternalLink href="https://www.apple.com/shop/product/MRMF2/magic-trackpad-2-space-gray">
    {children}
  </ExternalLink>
)
MagicTrackpadLink.propTypes = { ...linkPropTypes }

const LaptopStandLink = ({ children }) => (
  <ExternalLink href="https://www.amazon.com/Laptop-Stand-Adjustable-Portable-Ergonomic/dp/B0772LBQXM">
    {children}
  </ExternalLink>
)
LaptopStandLink.propTypes = { ...linkPropTypes }





const UsesPage = () => {
  let lastDelay = BASE_DELAY

  const getDelay = (options = {}) => {
    const {
      delayIncrement = CASCADE_DELAY_INCREMENT,
      extraDelay = 0,
    } = options

    const delay = lastDelay + extraDelay

    lastDelay = delay + delayIncrement

    return delay.toFixed(1).replace(/\.0$/u, '')
  }

  return (
    <PageWrapper
      description="With inspiration from https://uses.tech, this page lists software and hardware I use on a daily basis."
      title="Uses">
      <section>
        <h2
          data-animate
          data-animation="fade-in-from-left"
          data-animation-duration={BASE_DURATION}>
          Hardware
        </h2>

        <p
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          As a programmer, a gamer, a podcaster, <em>and</em> a livestreamer, I've got <strong>a lot</strong> of hardware.
        </p>

        <h3
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          Mobile Gear
        </h3>

        <p
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          I'm a big fan of fruity products, so you'll notice the majority of my mobile gear is made by Apple. I do most of my work on a <MacbookProLink>13" MacBook Pro (2017)</MacbookProLink> but, honestly, it's about time for an upgrade. The <abbr title="128 Gigabyte">128GB</abbr> <abbr title="Solid State Drive">SSD</abbr> absolutely is not big enough, and the machine barely slogs through when I'm running more than two Docker containers.
        </p>

        <figure
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          <figcaption>MacBook Pro Specs</figcaption>

          <ul className="fa-ul">
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon="microchip" />
              </span>
              2.3 GHz Dual-Core Intel Core i5
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon="memory" />
              </span>
              8GB RAM
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon="hdd" />
              </span>
              128GB SSD
            </li>
            <li>
              <span className="fa-li">
                <span className="fa-layers">
                  <FontAwesomeIcon
                    icon="ban"
                    transform="grow-8" />
                  <FontAwesomeIcon
                    icon="fingerprint"
                    transform="shrink-2" />
                </span>
              </span>
              <strong>No touchbar</strong>
            </li>
          </ul>
        </figure>

        <p
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          I use <ExternalLink href="https://www.apple.com/shop/product/MWP22AM/A/airpods-pro">Apple AirPods Pro</ExternalLink> for listening to my jams while I'm on the go. I use my <ExternalLink href="https://www.apple.com/shop/buy-ipad/ipad-pro">11" iPad Pro</ExternalLink> as a second screen sometimes, though more often than not I prefer working on a single screen.
        </p>

        <p
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          I also carry an Apple <MagicKeyboardLink>Magic Keyboard</MagicKeyboardLink>, a <MagicTrackpadLink>Magic Trackpad 2</MagicTrackpadLink>, and a <LaptopStandLink>Jubor laptop stand</LaptopStandLink>. These prevent my back from hating me for hunching over a laptop for several hours. <span aria-label="Grinning Emoji" role="img">😁</span>
        </p>

        <h3
          data-animate
          data-animation="fade-in-from-left"
          /* eslint-disable-next-line no-magic-numbers */
          data-animation-delay={`${getDelay({
            delayIncrement: BASE_DELAY,
            extraDelay: 0.5,
          })}s`}
          data-animation-duration={BASE_DURATION}>
          Home Office
        </h3>

        <p
          data-animate
          data-animation="fade-in-from-top-small"
          data-animation-delay={`${getDelay()}s`}
          data-animation-duration={BASE_DURATION}>
          When I work from my home office, I usually hook my MacBook up to the rest of this gear.
        </p>

        <ul className="fa-ul">
          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon="desktop" />
            </span>

            <ExternalLink href="https://store.hp.com/us/en/pdp/hp-27er-27-inch-display">
              HP 27es 27in Monitor
            </ExternalLink>
          </li>

          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon="hdd" />
            </span>

            <ExternalLink href="https://www.corsair.com/us/en/Categories/Products/Gaming-Keyboards/RGB-Mechanical-Gaming-Keyboards/k95-rgb-platinum-config-na/p/CH-9127114-NA">
              Corsair K95 RGB Platinum Mechanical Keyboard
            </ExternalLink>
          </li>

          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon="mouse" />
            </span>

            <ExternalLink href="https://www.corsair.com/us/en/Categories/Products/Gaming-Mice/FPS-Fast-Action-Mice/NIGHTSWORD-RGB-Tunable-FPS-MOBA-Gaming-Mouse/p/CH-9306011-NA">
              Corsair Nightsword RGB Mouse
            </ExternalLink>
          </li>

          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon="headphones" />
            </span>

            <ExternalLink href="https://www.corsair.com/us/en/Categories/Products/Gaming-Headsets/Wireless-Headsets/VOID-RGB-ELITE-Wireless-Premium-Gaming-Headset-with-7-1-Surround-Sound/p/CA-9011201-NA">
              Corsair VOID RGB Elite Wireless Headphones
            </ExternalLink>
          </li>

          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon={['fab', 'usb']} />
            </span>

            <ExternalLink href="https://www.corsair.com/us/en/Categories/Products/Gaming-Keyboards/RGB-Mechanical-Gaming-Keyboards/k95-rgb-platinum-config-na/p/CH-9127114-NA">
              Corsair ST100 RGB Headphones Stand
            </ExternalLink>
          </li>

          <li
            data-animate
            data-animation="fade-in-from-top-small"
            data-animation-delay={`${getDelay()}s`}
            data-animation-duration={BASE_DURATION}>
            <span className="fa-li">
              <FontAwesomeIcon icon="volume-up" />
            </span>

            <ExternalLink href="https://www.logitech.com/en-us/product/speaker-system-z623">
              Logitech Z623 Speaker System
            </ExternalLink>
          </li>
        </ul>
      </section>
    </PageWrapper>
  )
}





export default UsesPage
