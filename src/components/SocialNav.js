// Module imports
import PropTypes from 'prop-types'





// Local imports
import {
	Nav,
	NavLink,
} from 'components/Nav'





// Local constants
const defaultOptions = {
	extraProps: { rel: 'me' },
	iconOnly: true,
	iconPrefix: 'fab',
}





function SocialNav(props) {
	const { isOpen } = props

	return (
		<Nav
			className="social"
			isOpen={isOpen}>
			<NavLink
				{...defaultOptions}
				icon="twitter"
				title="Twitter"
				href="https://twitter.com/TrezyCodes" />

			<NavLink
				{...defaultOptions}
				icon="instagram"
				title="Instagram"
				href="https://instagram.com/TrezyCodes" />

			<NavLink
				{...defaultOptions}
				icon="linkedin"
				title="LinkedIn"
				href="https://linkedin.com/in/trezy" />

			<NavLink
				{...defaultOptions}
				icon="twitch"
				title="Twitch"
				href="https://twitch.tv/TrezyCodes" />

			<NavLink
				{...defaultOptions}
				icon="discord"
				title="Discord"
				href="https://discord.gg/k3bth3f" />

			<NavLink
				{...defaultOptions}
				icon="patreon"
				title="Patreon"
				href="https://www.patreon.com/trezy" />

			<NavLink
				{...defaultOptions}
				icon="github"
				title="Github"
				href="https://github.com/trezy" />

			<NavLink
				{...defaultOptions}
				icon="codepen"
				title="Codepen"
				href="https://codepen.io/trezy" />

			<NavLink
				{...defaultOptions}
				icon="npm"
				title="npm"
				href="https://npmjs.com/~trezy" />

			<NavLink
				{...defaultOptions}
				icon="dev"
				title="DEV Community"
				href="https://dev.to/trezy" />

			<NavLink
				{...defaultOptions}
				icon="speaker-deck"
				title="SpeakerDeck"
				href="https://speakerdeck.com/trezy" />

			<NavLink
				{...defaultOptions}
				icon="soundcloud"
				title="SoundCloud"
				href="https://soundcloud.com/TrezyCodes" />
		</Nav>
	)
}

SocialNav.defaultProps = {
	isOpen: true,
}

SocialNav.propTypes = {
	isOpen: PropTypes.bool,
}





export { SocialNav }
