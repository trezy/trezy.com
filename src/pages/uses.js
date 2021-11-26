// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { Block } from 'components/Block'
import { ExternalLink } from 'components/ExternalLink'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import PageWrapper from 'components/PageWrapper'





// Local constants
const CASCADE_DELAY_INCREMENT = 0.2
const BASE_DELAY = 0.6
const BASE_DURATION = 0.5
const linkPropTypes = { children: PropTypes.string.isRequired }

function AmazonLink(props) {
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

function AirpodsLink({ children }) {
	return (
		<ExternalLink href="https://www.apple.com/shop/product/MLWK3AM/A/airpods-pro">
			{children}
		</ExternalLink>
	)
}
AirpodsLink.propTypes = { ...linkPropTypes }

function MacbookProLink({ children }) {
	return (
	<ExternalLink href="https://www.apple.com/macbook-pro-13/">
		{children}
	</ExternalLink>
)
}
MacbookProLink.propTypes = { ...linkPropTypes }

function MagicKeyboardLink({ children }) {
	return (
		<ExternalLink href="https://www.apple.com/shop/product/MK2C3LL/A/magic-keyboard-with-touch-id-and-numeric-keypad-for-mac-models-with-apple-silicon-us-english">
		{children}
	</ExternalLink>
)
}
MagicKeyboardLink.propTypes = { ...linkPropTypes }

function MagicTrackpadLink({ children }) {
	return (
		<ExternalLink href="https://www.apple.com/shop/product/MK2D3AM/A/magic-trackpad">
		{children}
	</ExternalLink>
)
}
MagicTrackpadLink.propTypes = { ...linkPropTypes }

function LaptopStandLink({ children }) {
	return (
	<AmazonLink id="B0772LBQXM">
		{children}
	</AmazonLink>
)
}
LaptopStandLink.propTypes = { ...linkPropTypes }

function ChipIcon(props) {
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
		delay: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]).isRequired,
	}

	return (
		<PageWrapper
			description="With inspiration from https://uses.tech, this page lists the software and hardware I use on a daily basis."
			title="Uses">
			<Block>
				<p>{'Taking inspiration from '}<ExternalLink href="https://uses.tech">{'uses.tech'}</ExternalLink>{', this page lists the software and hardware I use for work, streaming, and gaming. Note that almost every link on this page is an affiliate link from which I may receive commissions.'}</p>
			</Block>

			<Block
				data-animate
				data-animation="fade-in-from-left"
				data-animation-delay={`${getDelay()}s`}>
				<h2>{'Mobile Gear'}</h2>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'I\'m a big fan of fruity products, so you\'ll notice the majority of my mobile gear is made by Apple. I do most of my work on a '}<MacbookProLink>{'13" M1 MacBook Pro (2020)'}</MacbookProLink>{' and it does a '}<em>{'wonderful'}</em>{' job.'}
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<header>{'MacBook Pro Specs'}</header>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							{'8-Core M1 '}<abbr title={'Central Processing Unit'}>{'CPU'}</abbr>{''}
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="memory" />
							</span>

							{'16'}<abbr title={'Gigabyte'}>{'GB'}</abbr>{' '}<abbr title={'Random Access Memory'}>{'RAM'}</abbr>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="hdd" />
							</span>

							{'1'}<abbr title={'Terabyte'}>{'TB'}</abbr>{' '}<abbr title={'Solid State Drive'}>{'SSD'}</abbr>
						</ListItem>
					</ul>
				</figure>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'I use '}<AirpodsLink>{'Apple AirPods Pro'}</AirpodsLink>{' for listening to my jams while I\'m on the go. I use my '}<ExternalLink href="https://www.apple.com/shop/buy-ipad/ipad-pro">{'11" iPad Pro'}</ExternalLink>{' as a second screen sometimes, though more often than not I prefer working on a single screen.'}
				</p>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'I also carry an Apple '}<MagicKeyboardLink>{'Magic Keyboard'}</MagicKeyboardLink>{', a '}<MagicTrackpadLink>{'Magic Trackpad 2'}</MagicTrackpadLink>{', and a '}<LaptopStandLink>{'Jubor laptop stand'}</LaptopStandLink>{'. These prevent my back from hating me for hunching over a laptop for several hours. Finally, I pack it all into a '}<AmazonLink id="B072XLW95H">{'handmade, vintage leather rucksack'}</AmazonLink>{'. '}<span aria-label="Grinning face emoji" role="img">{'😁'}</span>
				</p>
			</Block>

			<Block
				data-animate
				data-animation="fade-in-from-left"
				data-animation-delay={`${getDelay()}s`}
				data-animation-duration={BASE_DURATION}
				headerImageSource="https://images.ctfassets.net/6gqb05wxpzzi/6ZqMj0ZJ32pLLDSis6Npin/90d500d845aef705fcd403473163095e/IMG_2426.jpg">
				<h2>{'Home Office'}</h2>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'When working from home, I usually hook my MacBook up to a docking station with an external monitor for more screen real estate:'}
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<header>{'Docking Gear'}</header>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="desktop" />
							</span>

							<AmazonLink id="B07LBM2DCC">
								{'AOC 27-inch 4K Frameless Monitor'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="keyboard" />
							</span>

							<MagicKeyboardLink>
								{'Apple Magic Keyboard'}
							</MagicKeyboardLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="mouse" />
							</span>

							<MagicTrackpadLink>
								{'Apple Magic Trackpad 2'}
							</MagicTrackpadLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="headphones" />
							</span>

							<AirpodsLink>
								{'Apple AirPods Pro'}
							</AirpodsLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="space-shuttle" />
							</span>

							<AmazonLink id="B08DG87N7Z">
								{'Henge Vertical Docking Station'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon={['fab', 'usb']} />
							</span>

							<AmazonLink id="B08G9WDH6B">
								{'Brydge Stone Pro'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="chair" />
							</span>

							<ExternalLink href="https://secretlab.co/products/titan-evo-2022-series">
								{'SecretLabs TITAN Evo 2022 Series'}
							</ExternalLink>
						</ListItem>
					</ul>
				</figure>
			</Block>

			<Block
				data-animate
				data-animation="fade-in-from-left"
				data-animation-delay={`${getDelay()}s`}
				data-animation-duration={BASE_DURATION}
				headerImageSource="https://images.ctfassets.net/6gqb05wxpzzi/6SUOkjkIqVNwuXa7KXs8Ti/336130aa6b059410a3d35bbc007cd64d/IMG_2485-1.jpg">
				<h2>{'Streaming'}</h2>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'I use a two computer streaming setup. I do all of my work on my MacBook Pro while it\'s connected to the dock system mentioned above. Then I run an HDMI cable from my MacBook Pro to one of the capture cards on my streaming machine.'}
				</p>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'On my streaming machine, I run '}<ExternalLink href="https://obsproject.com/"><abbr title="Open Broadcaster Software">{'OBS'}</abbr></ExternalLink>{' to combine the input from my MacBook Pro and my Logitech cameras to create the stream!'}
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<header>{'Streaming Machine (Internals)'}</header>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							<AmazonLink id="B07SXMZLPJ">
								{'AMD Ryzen 7 3800X'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microchip" />
							</span>

							<AmazonLink id="B07WL5MFXL">
								{'Gigabyte X570 AORUS Elite Wi-Fi Motherboard'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="thermometer-half" />
							</span>

							<AmazonLink id="B08CXDWFKC">
								{'Lian Li Galahad AIO (240mm)'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="thermometer-half" />
							</span>

							<AmazonLink id="B08HKDBW6F">
								{'Lian Li SL120 Uni Fan (9x)'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="memory" />
							</span>

							<AmazonLink id="B016ORTNI2">
								{'Corsair LPX 32GB RAM (2x 16GB)'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<ChipIcon type="video" />
							</span>

							<AmazonLink id="B019M5IB2C">
								{'Magewell Pro Capture Card'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="plug" />
							</span>

							<AmazonLink id="B07F84FJ1G">
								{'Corsair SF Series 600-watt Power Supply'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="server" />
							</span>

							<AmazonLink id="B096JF2JT5">
								{'Lian Li O11 Dynamic Mini Case - Snow White Edition'}
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<header>{'Streaming Machine (Peripherals)'}</header>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="desktop" />
							</span>

							<AmazonLink id="B07LBM2DCC">
								{'AOC 27-inch 4K Frameless Monitor'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="keyboard" />
							</span>

							<AmazonLink id="B082GRKQYF">
								{'Corsair K95 RGB Platinum Mechanical Keyboard'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="mouse" />
							</span>

							<AmazonLink id="B07QX9C9WH">
								{'Corsair Nightsword RGB Mouse'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="headphones" />
							</span>

							<AmazonLink id="B07X8SJ8HM">
								{'Corsair VOID RGB Elite Wireless Headphones'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon={['fab', 'usb']} />
							</span>

							<AmazonLink id="B074ZQJW9R">
								{'Corsair ST100 RGB Headphones Stand'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B00N624FPA">
								{'Blue Yeti Microphone'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="camera-retro" />
							</span>

							<AmazonLink id="B01N5UOYC4">
								{'Logitech Brio Camera'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="camera-retro" />
							</span>

							<AmazonLink id="B01LXCDPPK">
								{'Logitech C922 Pro Camera'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="volume-up" />
							</span>

							<AmazonLink id="B003VAHYTG">
								{'Logitech Z623 Speaker System'}
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>

				<p
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					{'While this setup is great, it\'s not doing all of the work! I have several other pieces of gear that really make my streams stand out.'}
				</p>

				<figure
					data-animate
					data-animation="fade-in-from-top-small"
					data-animation-delay={`${getDelay()}s`}
					data-animation-duration={BASE_DURATION}>
					<header>{'Other Gear'}</header>

					<ul className="fa-ul">
						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="lightbulb" />
							</span>

							<AmazonLink id="B07L755X9G">
								{'Elgato Key Light'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="person-booth" />
							</span>

							<AmazonLink id="B0743Z892W">
								{'Elgato Green Screen'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B07FSVL3B4">
								{'Blue Compass Mic Arm'}
							</AmazonLink>
						</ListItem>

						<ListItem delay={getDelay({ delayIncrement: 0.2 })}>
							<span className="fa-li">
								<FontAwesomeIcon icon="microphone-alt" />
							</span>

							<AmazonLink id="B071YTY3QS">
								{'Knox Gear Shock Mount for Blue Yeti Microphones'}
							</AmazonLink>
						</ListItem>
					</ul>
				</figure>
			</Block>
		</PageWrapper>
	)
}
