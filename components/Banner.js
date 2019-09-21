// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {
  useState,
  useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Local imports
import handleRouterEvent from '../effects/handleRouterEvent'
import handleKeyboardEvent from '../effects/handleKeyboardEvent'
import Nav from './Nav'
import withFirebase from './withFirebase'





// Local constants
const navItems = [
  {
    href: '/',
    icon: 'home',
    title: 'Home',
  },
  {
    href: '/blog',
    icon: 'book',
    title: 'Blog',
  },
  {
    href: '/about',
    icon: 'user',
    title: 'About',
  },
  {
    className: ({ isLive }) => classnames('stream-badge', {
      live: isLive,
    }),
    condition: ({ isLive }) => isLive,
    /* eslint-disable-next-line react/prop-types */
    iconComponent: () => (
      <span className="fa-layers fa-fw live-indicator">
        <FontAwesomeIcon
          aria-hidden
          icon="circle" />

        <FontAwesomeIcon
          aria-hidden
          icon={['far', 'circle']} />

        <FontAwesomeIcon
          aria-hidden
          icon={['far', 'circle']} />
      </span>
    ),
    title: ({ isLive }) => {
      if (isLive) {
        return 'Trezy is live!'
      }

      return 'Trezy is offline'
    },
    href: 'https://twitch.tv/TrezyCodes',
  },

  // Only while logged out
  // {
  //   icon: 'sign-in-alt',
  //   title: 'Login',
  //   route: 'login',
  //   condition: ({ currentUser }) => !currentUser,
  // },

  // Only while logged in
  {
    href: '/dashboard',
    icon: 'tachometer-alt',
    title: 'Dashboard',
    condition: ({ currentUser }) => Boolean(currentUser),
  },
  {
    icon: 'sign-out-alt',
    title: 'Logout',
    condition: ({ currentUser }) => Boolean(currentUser),
    onClick: (event, {
      close,
      signOut,
    }) => {
      signOut()
      close()
      Router.push('/login')
    },
  },
]
const socialItems = [
  {
    extraProps: { rel: 'me' },
    icon: 'twitter',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Twitter',
    href: 'https://twitter.com/TrezyCodes',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'instagram',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Instagram',
    href: 'https://instagram.com/TrezyCodes',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'linkedin',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'twitch',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Twitch',
    href: 'https://twitch.tv/TrezyCodes',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'discord',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Discord',
    href: 'https://discord.gg/k3bth3f',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'patreon',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Patreon',
    href: 'https://www.patreon.com/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'github',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Github',
    href: 'https://github.com/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'codepen',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Codepen',
    href: 'https://codepen.io/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'npm',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'npm',
    href: 'https://npmjs.com/~trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'dev',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'DEV Community',
    href: 'https://dev.to/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'speaker-deck',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'speakerdeck',
    href: 'https://speakerdeck.com/trezy',
  },
  {
    extraProps: { rel: 'me' },
    icon: 'soundcloud',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'SoundCloud',
    href: 'https://soundcloud.com/TrezyCodes',
  },
]





const Banner = props => {
  const {
    firebaseApp,
    signOut,
  } = props

  const { currentUser } = firebaseApp.auth()

  const [isLive, setIsLive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const close = () => {
    const focusedElement = document.querySelector('[role=banner] *:focus')

    if (focusedElement) {
      focusedElement.blur()
    }

    setIsOpen(false)
  }

  useEffect(handleRouterEvent('routeChangeComplete', close))
  useEffect(handleKeyboardEvent('keyup', ({ key }) => {
    if (key.toLowerCase() === 'escape') {
      close()
    }
  }), [isOpen])
  useEffect(() => {
    const ref = firebaseApp.database().ref('/app-data/stream/online')

    ref.on('value', snapshot => setIsLive(snapshot.val()))

    return () => ref.off('value')
  })

  return (
    <>
      <input
        aria-label="Banner &amp; Navigation toggle"
        checked={isOpen}
        hidden
        id="banner-control"
        onChange={({ target: { checked } }) => setIsOpen(checked)}
        type="checkbox" />

      <header role="banner">
        {/* eslint-disable jsx-a11y/tabindex-no-positive */}
        <label
          aria-pressed={isOpen ? 'true' : 'false'}
          className="button iconic primary"
          htmlFor="banner-control"
          onKeyUp={({ key }) => ['enter', ' '].includes(key.toLowerCase()) && setIsOpen(!isOpen)}
          role="button"
          tabIndex="1"
          title="Expand/Collapse Menu">
          <FontAwesomeIcon
            data-animate
            data-animation={`fade-${isOpen ? 'out' : 'in'}`}
            data-animation-duration="0.2s"
            fixedWidth
            icon="bars" />

          <FontAwesomeIcon
            data-animate
            data-animation={`fade-${isOpen ? 'in' : 'out'}`}
            data-animation-duration="0.2s"
            fixedWidth
            icon="times" />

          <span className="screen-reader-only">Menu</span>
        </label>
        {/* eslint-disable jsx-a11y/tabindex-no-positive */}

        <h1 className="brand">&lt;trezy-who/&gt;</h1>

        <Nav
          close={close}
          isLive={isLive}
          isOpen={isOpen}
          items={navItems}
          signOut={signOut}
          currentUser={currentUser} />

        <Nav
          className="social"
          isOpen={isOpen}
          items={socialItems} />
      </header>
    </>
  )
}

Banner.propTypes = {
  firebaseApp: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
}





export default withFirebase(Banner)
