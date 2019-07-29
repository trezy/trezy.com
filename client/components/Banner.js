// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {
  useState,
  useEffect,
} from 'react'
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
    icon: 'user',
    key: 'about',
    title: 'About',
    route: 'home',
  },
  {
    icon: 'pencil-alt',
    key: 'blog',
    title: 'Blog',
    route: 'blog',
  },

  // Only while logged out
  // {
  //   icon: 'sign-in-alt',
  //   key: 'login',
  //   title: 'Login',
  //   route: 'login',
  //   condition: ({ currentUser }) => !currentUser,
  // },

  // Only while logged in
  {
    icon: 'tachometer-alt',
    key: 'dashboard',
    title: 'Dashboard',
    route: 'dashboard',
    condition: ({ currentUser }) => Boolean(currentUser),
  },
  {
    icon: 'sign-out-alt',
    key: 'logout',
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
    icon: 'github',
    iconOnly: true,
    iconPrefix: 'fab',
    key: 'github',
    title: 'Github',
    href: 'https://github.com/trezy',
  },
  {
    icon: 'twitter',
    iconOnly: true,
    iconPrefix: 'fab',
    key: 'twitter',
    title: 'Twitter',
    href: 'https://twitter.com/TrezyCodes',
  },
  {
    icon: 'twitch',
    iconOnly: true,
    iconPrefix: 'fab',
    key: 'twitch',
    title: 'Twitch',
    href: 'https://twitch.tv/TrezyCodes',
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
        <label
          aria-pressed={isOpen ? 'true' : 'false'}
          className="button primary"
          htmlFor="banner-control"
          onKeyUp={({ key }) => ['enter', ' '].includes(key.toLowerCase()) && setIsOpen(!isOpen)}
          role="button"
          tabIndex="0"
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
        </label>

        <h1 className="brand">&lt;trezy-who/&gt;</h1>

        <Nav
          close={close}
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
