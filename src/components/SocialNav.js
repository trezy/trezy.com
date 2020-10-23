// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import Nav from 'components/Nav'





// Local constants
const defaultIconOptions = {
  extraProps: { rel: 'me' },
  iconOnly: true,
  iconPrefix: 'fab',
}
const socialItems = [
  {
    ...defaultIconOptions,
    icon: 'twitter',
    title: 'Twitter',
    href: 'https://twitter.com/TrezyCodes',
  },
  {
    ...defaultIconOptions,
    icon: 'instagram',
    title: 'Instagram',
    href: 'https://instagram.com/TrezyCodes',
  },
  {
    ...defaultIconOptions,
    icon: 'linkedin',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'twitch',
    title: 'Twitch',
    href: 'https://twitch.tv/TrezyCodes',
  },
  {
    ...defaultIconOptions,
    icon: 'discord',
    title: 'Discord',
    href: 'https://discord.gg/k3bth3f',
  },
  {
    ...defaultIconOptions,
    icon: 'patreon',
    title: 'Patreon',
    href: 'https://www.patreon.com/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'github',
    title: 'Github',
    href: 'https://github.com/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'codepen',
    title: 'Codepen',
    href: 'https://codepen.io/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'npm',
    title: 'npm',
    href: 'https://npmjs.com/~trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'dev',
    title: 'DEV Community',
    href: 'https://dev.to/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'speaker-deck',
    title: 'speakerdeck',
    href: 'https://speakerdeck.com/trezy',
  },
  {
    ...defaultIconOptions,
    icon: 'soundcloud',
    title: 'SoundCloud',
    href: 'https://soundcloud.com/TrezyCodes',
  },
]





const SocialNav = ({ isOpen }) => (
  <Nav
    className="social"
    isOpen={isOpen}
    items={socialItems} />
)

SocialNav.defaultProps = {
  isOpen: true,
}

SocialNav.propTypes = {
  isOpen: PropTypes.bool,
}





export default SocialNav
