// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import NavLink from './NavLink'
import renderNavItemTitle from '../helpers/renderNavItemTitle'
import Subnav from './Subnav'





// Constants
const navItems = [
  {
    key: 'home',
    title: 'Home',
    route: 'home',
  },
  {
    key: 'about',
    title: 'About',
    route: 'about',
  },
  {
    key: 'social',
    title: 'Social',
    subnav: [
      {
        key: 'twitter',
        title: 'Twitter',
        href: 'https://twitter.com/TrezyCodes',
      },
      {
        key: 'twitch',
        title: 'Twitch',
        href: 'https://twitch.tv/TrezyCodes',
      },
      {
        key: 'github',
        title: 'Github',
        href: 'https://github.com/trezy',
      },
    ],
  },
]





const Nav = props => {
  const { isOpen } = props

  return (
    <nav
      aria-expanded={isOpen}
      aria-hidden={!isOpen}>
      <ul>
        {navItems.map(item => {
          const {
            condition,
            title,
            subnav,
          } = item

          if (condition && !condition(props)) {
            return null
          }

          return (
            <li key={title}>
              {subnav && (
                <Subnav
                  {...item}
                  isFocusable={isOpen} />
              )}

              {!subnav && (
                <NavLink
                  {...item}
                  isFocusable={isOpen}
                  title={renderNavItemTitle(item, title)} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

Nav.defaultProps = {
  isOpen: true,
}

Nav.propTypes = {
  isOpen: PropTypes.bool,
}





export default Nav
