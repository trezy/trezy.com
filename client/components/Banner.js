// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {
  useState,
  useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Component imports
import { Router } from '../routes'
import handleRouterEvent from '../effects/handleRouterEvent'
import handleKeyboardEvent from '../effects/handleKeyboardEvent'
import Nav from './Nav'
import withFirebaseAuth from './withFirebaseAuth'





// Local constants
const navItems = [
  {
    icon: 'home',
    title: 'Home',
    route: 'home',
  },
  {
    icon: 'book',
    title: 'Blog',
    route: 'blog',
  },
  {
    icon: 'user',
    title: 'About',
    route: 'about',
  },
  {
    className: ({ isLive }) => classnames('stream-badge', {
      live: isLive,
    }),
    /* eslint-disable-next-line react/prop-types */
    iconComponent: ({ isLive }) => {
      if (isLive) {
        return (
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
        )
      }

      return (
        <FontAwesomeIcon
          aria-hidden
          fixedWidth
          icon="minus-circle" />
      )
    },
    // icon: ({ isLive }) => {
    //   if (isLive) {
    //     return 'circle'
    //   }

    //   return 'minus-circle'
    // },
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
    icon: 'tachometer-alt',
    title: 'Dashboard',
    route: 'dashboard',
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
    icon: 'twitter',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Twitter',
    href: 'https://twitter.com/TrezyCodes',
  },
  {
    icon: 'instagram',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Instagram',
    href: 'https://instagram.com/TrezyCodes',
  },
  {
    icon: 'linkedin',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/trezy',
  },
  {
    icon: 'twitch',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Twitch',
    href: 'https://twitch.tv/TrezyCodes',
  },
  {
    icon: 'discord',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Discord',
    href: 'https://discord.gg/k3bth3f',
  },
  {
    icon: 'patreon',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Patreon',
    href: 'https://www.patreon.com/trezy',
  },
  {
    icon: 'github',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Github',
    href: 'https://github.com/trezy',
  },
  {
    icon: 'codepen',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'Codepen',
    href: 'https://codepen.io/trezy',
  },
  {
    icon: 'npm',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'npm',
    href: 'https://npmjs.com/~trezy',
  },
  {
    icon: 'dev',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'DEV Community',
    href: 'https://dev.to/trezy',
  },
  {
    icon: 'speaker-deck',
    iconOnly: true,
    iconPrefix: 'fab',
    title: 'speakerdeck',
    href: 'https://speakerdeck.com/trezy',
  },
  {
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
          isLive
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





export default withFirebaseAuth(Banner)
