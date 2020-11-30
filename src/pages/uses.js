// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import ExternalLink from 'components/ExternalLink'
import PageWrapper from 'components/PageWrapper'





// Local constants
const CASCADE_DELAY_INCREMENT = 0.2
const BASE_DELAY = 0.6
const BASE_DURATION = 0.5
const linkPropTypes = { children: PropTypes.string.isRequired }

const AmazonLink = props => {
	const {
		children,
		id,
	} = props

	return (
		<ExternalLink href={`https://www.amazon.com/dp/${id}?tag=trezycodes-20`}>
			{children}
		</ExternalLink>
	)
}
AmazonLink.propTypes = {
	...linkPropTypes,
	id: PropTypes.string.isRequired,
}

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
	<AmazonLink id="B0772LBQXM">
		{children}
	</AmazonLink>
)
LaptopStandLink.propTypes = { ...linkPropTypes }

const ChipIcon = props => {
	const {
		className,
		type,
	} = props

	return (
		<span className={classnames('fa-layers', 'fa-fw', className)}>
			<FontAwesomeIcon icon="memory" />
			<FontAwesomeIcon
				icon="square-full"
				transform="shrink-8 left-2 up-2" />
			<FontAwesomeIcon
				icon="square-full"
				transform="shrink-8 up-2" />
			<FontAwesomeIcon
				icon="square-full"
				transform="shrink-8 right-2 up-2" />
			<FontAwesomeIcon
				icon={type}
				inverse
				transform="shrink-8 up-2" />
		</span>
	)
}
ChipIcon.defaultProps = {
	className: '',
}
ChipIcon.propTypes = {
	className: PropTypes.string,
	type: PropTypes.string.isRequired,
}





export default function UsesPage() {
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

	const ListItem = props => {
		const {
			children,
			delay,
		} = props

		return (
			<li
				data-animate
				data-animation="fade-in-from-left-small"
				data-animation-delay={`${delay}s`}
				data-animation-duration={BASE_DURATION}>
				{children}
			</li>
		)
	}
	ListItem.propTypes = {
		children: PropTypes.any.isRequired,
		delay: PropTypes.number.isRequired,
	}

	return (
		<PageWrapper
			description="With inspiration from https://uses.tech, this page lists the software and hardware I use on a daily basis."
			title="Uses">
			<section
				className="block"
				data-animate
				data-animation="fade-in-from-left"
				/* eslint-disable-next-line no-magic-numbers */
				data-animation-delay={`${getDelay()}s`}>
				<h2>Mobile Gear</h2>

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
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							2.3 GHz Dual-Core Intel Core i5
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="memory" />
							</span>

							8GB RAM
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="hdd" />
							</span>

							128GB SSD
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
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
						</ListItem>
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
					I also carry an Apple <MagicKeyboardLink>Magic Keyboard</MagicKeyboardLink>, a <MagicTrackpadLink>Magic Trackpad 2</MagicTrackpadLink>, and a <LaptopStandLink>Jubor laptop stand</LaptopStandLink>. These prevent my back from hating me for hunching over a laptop for several hours. Finally, I pack it all into a <AmazonLink id="B072XLW95H">handmade vintage leather rucksack</AmazonLink>. <span aria-label="Grinning face emoji" role="img">😁</span>
				</p>
			</section>

			<section
				className="block"
				data-animate
				data-animation="fade-in-from-left"
				/* eslint-disable-next-line no-magic-numbers */
				data-animation-delay={`${getDelay()}s`}
				data-animation-duration={BASE_DURATION}>
				<h2>Home Office</h2>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					When working from home, I usually hook my MacBook up to a docking station with an external monitor so I can get a little more screen real estate:
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<figcaption>Docking Gear</figcaption>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="desktop" />
							</span>

							<AmazonLink id="B07LBM2DCC">
								AOC 27-inch 4K Frameless Monitor
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="keyboard" />
							</span>

							<MagicKeyboardLink>
								Apple Magic Keyboard
							</MagicKeyboardLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="mouse" />
							</span>

							<MagicTrackpadLink>
								Apple Magic Trackpad 2
							</MagicTrackpadLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="headphones" />
							</span>

							<ExternalLink href="https://www.apple.com/shop/product/MWP22/airpods-pro">
								Apple AirPods Pro
							</ExternalLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="space-shuttle" />
							</span>

							<AmazonLink id="B07MZZGLCM">
								Henge Vertical Docking Station
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon={['fab', 'usb']} />
							</span>

							<AmazonLink id="B07D42ZV9D">
								j5create USB-C Mini Dock
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="chair" />
							</span>

							<AmazonLink id="B07BDHGYXR">
								Vitesse Gaming Chair
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>
			</section>

			<section
				className="block"
				data-animate
				data-animation="fade-in-from-left"
				/* eslint-disable-next-line no-magic-numbers */
				data-animation-delay={`${getDelay()}s`}
				data-animation-duration={BASE_DURATION}>
				<h2>Streaming</h2>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					I use a two computer streaming setup. I do all of my work on my MacBook Pro while it's connected to the dock system mentioned above. Then I run an HDMI cable from my MacBook Pro to one of the capture cards on my streaming machine.
				</p>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					On my streaming machine, I run <ExternalLink href="https://streamlabs.com/">StreamLabs OBS</ExternalLink>. Finally, I combine the input from my MacBook Pro and my Logitech C922 Pro Webcam to create the stream!
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<figcaption>Streaming Machine (Internals)</figcaption>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							<AmazonLink id="B007SZ0EOM">
								3.1 GHz Quad-Core Intel Core i7-3770S
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							<ExternalLink href="https://www.newegg.com/p/N82E16813130643">
								MSI Z77A-GD65 Motherboard
							</ExternalLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="thermometer-half" />
							</span>

							<AmazonLink id="B079NXZQBC">
								Corsair H60 CPU Cooler
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="memory" />
							</span>

							<AmazonLink id="B0064DQR9U">
								32GB G.SKILL Ripjaws X Series RAM (4x 8GB)
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<ChipIcon type="wifi" />
							</span>

							<AmazonLink id="B01H9QMOMY">
								ASUS 4x4 AC3100 WiFi Card
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<ChipIcon type="video" />
							</span>

							<AmazonLink id="B00CDIVL2S">
								Blackmagic Design DeckLink (x2)
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="plug" />
							</span>

							<ExternalLink href="https://www.newegg.com/p/N82E16817182084">
								Rosewill Fortress 750-watt Power Supply
							</ExternalLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="server" />
							</span>

							<AmazonLink id="B00FFJ0H3Q">
								Cooler Master HAF XB EVO Case
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<figcaption>Streaming Machine (Peripherals)</figcaption>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="desktop" />
							</span>

							<AmazonLink id="B07LBM2DCC">
								AOC 27-inch 4K Frameless Monitor
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="keyboard" />
							</span>

							<AmazonLink id="B082GRKQYF">
								Corsair K95 RGB Platinum Mechanical Keyboard
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="mouse" />
							</span>

							<AmazonLink id="B07QX9C9WH">
								Corsair Nightsword RGB Mouse
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="headphones" />
							</span>

							<AmazonLink id="B07X8SJ8HM">
								Corsair VOID RGB Elite Wireless Headphones
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon={['fab', 'usb']} />
							</span>

							<AmazonLink id="B074ZQJW9R">
								Corsair ST100 RGB Headphones Stand
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B00N624FPA">
								Blue Yeti Microphone
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="camera-retro" />
							</span>

							<AmazonLink id="B01LXCDPPK">
								Logitech C922 Pro Camera
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="volume-up" />
							</span>

							<AmazonLink id="B003VAHYTG">
								Logitech Z623 Speaker System
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					While this setup is great, it's not doing all of the work! I'm also using several additional pieces of gear to really make the stream stand out.
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<figcaption>Other Gear</figcaption>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="lightbulb" />
							</span>

							<AmazonLink id="B07L755X9G">
								Elgato Key Light
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="person-booth" />
							</span>

							<AmazonLink id="B0743Z892W">
								Elgato Green Screen
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B07FSVL3B4">
								Blue Compass Mic Arm
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B071YTY3QS">
								Knox Gear Shock Mount for Blue Yeti Microphones
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>
			</section>
		</PageWrapper>
	)
}
