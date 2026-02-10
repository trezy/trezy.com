// Module imports
import {
	faBluesky,
	faCodepen,
	faDev,
	faDiscord,
	faGithub,
	faInstagram,
	faLinkedin,
	faMastodon,
	faNpm,
	faSpeakerDeck,
	faTwitter,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons'
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
}





function SocialNav(props) {
	const { isOpen = true } = props

	return (
		<Nav
			className={'social'}
			isOpen={isOpen}>
			<NavLink
				{...defaultOptions}
				icon={faBluesky}
				title={'Bluesky'}
				href={'https://bsky.app/profile/trezy.codes'} />

			<NavLink
				{...defaultOptions}
				icon={faMastodon}
				title={'Mastodon'}
				href={'https://mastodon.social/TrezyCodes'} />

			<NavLink
				{...defaultOptions}
				icon={faTwitter}
				title={'Twitter'}
				href={'https://twitter.com/TrezyCodes'} />

			<NavLink
				{...defaultOptions}
				icon={faInstagram}
				title={'Instagram'}
				href={'https://instagram.com/TrezyCodes'} />

			<NavLink
				{...defaultOptions}
				icon={faLinkedin}
				title={'LinkedIn'}
				href={'https://linkedin.com/in/trezy'} />

			<NavLink
				{...defaultOptions}
				icon={faYoutube}
				title={'YouTube'}
				href={'/youtube'} />

			<NavLink
				{...defaultOptions}
				icon={faDiscord}
				title={'Discord'}
				href={'/discord'} />

			<NavLink
				{...defaultOptions}
				icon={faGithub}
				title={'Github'}
				href={'https://github.com/trezy'} />

			<NavLink
				{...defaultOptions}
				icon={faCodepen}
				title={'Codepen'}
				href={'https://codepen.io/trezy'} />

			<NavLink
				{...defaultOptions}
				icon={faNpm}
				title={'npm'}
				href={'https://npmjs.com/~trezy'} />

			<NavLink
				{...defaultOptions}
				icon={faDev}
				title={'DEV Community'}
				href={'https://dev.to/trezy'} />

			<NavLink
				{...defaultOptions}
				icon={faSpeakerDeck}
				title={'SpeakerDeck'}
				href={'https://speakerdeck.com/trezy'} />
		</Nav>
	)
}

SocialNav.propTypes = {
	isOpen: PropTypes.bool,
}





export { SocialNav }
