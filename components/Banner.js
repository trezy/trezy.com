// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  isEmpty,
  useFirebase,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import classnames from 'classnames'





// Local imports
import Nav from './Nav'
import SocialNav from './SocialNav'
import useAuthSelector from '../store/selectors/useAuthSelector'
import useClaimsSelector from '../store/selectors/useClaimsSelector'
import useDocumentEvent from '../effects/useDocumentEvent'
import useRouterEvent from '../effects/useRouterEvent'
import useWindowEvent from '../effects/useWindowEvent'





// Local constants
const RESIZE_BREAKPOINT = 1300
const RESIZE_DEBOUNCE_TIME = 500
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
  {
    href: ({ Router }) => `/login?destination=${Router.asPath}`,
    icon: 'sign-in-alt',
    title: 'Login',
    condition: ({ auth }) => isEmpty(auth),
  },

  // Only while logged in
  {
    href: '/dashboard',
    icon: 'tachometer-alt',
    title: 'Dashboard',
    condition: ({ auth, claims }) => !isEmpty(auth) && claims['views.dashboard'],
  },
  {
    icon: 'user-shield',
    title: 'Admin',
    condition: ({ auth }) => !isEmpty(auth),
    subnav: [
      {
        href: '/dashboard/blog',
        icon: 'book',
        title: 'Blog',
        condition: ({ auth, claims }) => !isEmpty(auth) && claims['views.dashboard.blog'],
      },
    ],
  },
  {
    icon: 'tools',
    title: 'Tools',
    condition: ({ auth, claims }) => !isEmpty(auth) && claims['views.tools'],
    subnav: [
      {
        href: '/tools/movie-buddy',
        icon: 'film',
        title: 'Movie List',
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
      Router,
    }) => {
      logout()
      close()
      Router.push('/login')
    },
  },
]





const Banner = () => {
  const firebase = useFirebase()
  const auth = useAuthSelector()
  const claims = useClaimsSelector()
  const isLive = useSelector(state => state.firebase.data?.['app-data']?.stream.online)

  const [currentWidth, setCurrentWidth] = useState((typeof window === 'undefined') ? 0 : window.innerWidth)
  const [isOpen, setIsOpen] = useState(currentWidth <= RESIZE_BREAKPOINT)

  const close = () => {
    const focusedElement = document.querySelector('[role=banner] *:focus')

    if (focusedElement) {
      focusedElement.blur()
    }

    setIsOpen(false)
  }

  const updateOpenStateFromWindowSize = () => {
    if (isOpen && (currentWidth <= RESIZE_BREAKPOINT)) {
      close()
    } else {
      setIsOpen(true)
    }
  }

  useFirebaseConnect([
    { path: 'app-data' },
  ])

  useDocumentEvent('keyup', ({ key }) => {
    if (isOpen && (key.toLowerCase() === 'escape')) {
      close()
    }
  }, [isOpen])
  useRouterEvent('routeChangeComplete', updateOpenStateFromWindowSize)
  useRouterEvent('routeChangeError', updateOpenStateFromWindowSize)
  useEffect(updateOpenStateFromWindowSize, [currentWidth])

  useWindowEvent('resize', debounce(() => {
    if (window.innerWidth !== currentWidth) {
      setCurrentWidth(window.innerWidth)
    }
  }, RESIZE_DEBOUNCE_TIME))

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
          auth={auth}
          claims={claims}
          close={close}
          isLive={isLive}
          isOpen={isOpen}
          items={navItems}
          logout={firebase.logout} />

        <SocialNav isOpen={isOpen} />
      </header>
    </>
  )
}





export default Banner
