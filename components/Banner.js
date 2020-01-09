// Module imports
import React, {
  useState,
  useEffect,
} from 'react'
import {
  isEmpty,
  useFirebase,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Router from 'next/router'





// Local imports
import handleRouterEvent from '../effects/handleRouterEvent'
import handleKeyboardEvent from '../effects/handleKeyboardEvent'
import Nav from './Nav'
import SocialNav from './SocialNav'





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
  //   condition: ({ auth }) => !auth,
  // },

  // Only while logged in
  {
    icon: 'tools',
    title: 'Tools',
    condition: ({ auth }) => !isEmpty(auth),
    subnav: [
      {
        href: '/tools/movie-buddy',
        icon: 'film',
        title: 'Movie List',
      },
    ],
  },
  {
    icon: 'user-shield',
    title: 'Admin',
    condition: ({ auth }) => !isEmpty(auth),
    subnav: [
      {
        href: '/dashboard',
        icon: 'tachometer-alt',
        title: 'Dashboard',
      },
      {
        href: '/dashboard/blog',
        icon: 'book',
        title: 'Blog',
      },
    ],
  },
  {
    icon: 'sign-out-alt',
    title: 'Logout',
    condition: ({ auth }) => !isEmpty(auth),
    onClick: (event, {
      close,
      logout,
    }) => {
      logout()
      close()
      Router.push('/login')
    },
  },
]
const resizeBreakpoint = 1300





// Local variables
let currentWidth = (typeof window === 'undefined') ? 0 : window.innerWidth
let previousWidth = currentWidth





const Banner = () => {
  const firebase = useFirebase()
  const auth = useSelector(state => state.firebase.auth)

  const [isOpen, setIsOpen] = useState(previousWidth >= resizeBreakpoint)

  const close = () => {
    const focusedElement = document.querySelector('[role=banner] *:focus')

    if (focusedElement) {
      focusedElement.blur()
    }

    setIsOpen(false)
  }

  const handleResize = () => {
    currentWidth = window.innerWidth

    if (Math.max(currentWidth, previousWidth) <= resizeBreakpoint) {
      return
    }

    if (Math.min(currentWidth, previousWidth) >= resizeBreakpoint) {
      return
    }

    setIsOpen(currentWidth >= resizeBreakpoint)

    previousWidth = currentWidth
  }

  useFirebaseConnect([
    { path: 'app-data' },
  ])

  useEffect(handleRouterEvent('routeChangeComplete', close))

  useEffect(handleKeyboardEvent('keyup', ({ key }) => {
    if (key.toLowerCase() === 'escape') {
      close()
    }
  }), [isOpen])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  })

  const isLive = useSelector(state => state.firebase.data?.['app-data']?.stream.online)

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
        {/* eslint-disable jsx-a11y/tabindex-no-positive,jsx-a11y/no-noninteractive-element-to-interactive-role */}
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
        {/* eslint-disable jsx-a11y/tabindex-no-positive,jsx-a11y/no-noninteractive-element-to-interactive-role */}

        <h1 className="brand">&lt;trezy-who/&gt;</h1>

        <Nav
          close={close}
          isLive={isLive}
          isOpen={isOpen}
          items={navItems}
          logout={firebase.logout}
          auth={auth} />

        <SocialNav isOpen={isOpen} />
      </header>
    </>
  )
}





export default Banner
