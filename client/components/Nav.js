// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import NavLink from './NavLink'
import renderNavItemTitle from '../helpers/renderNavItemTitle'
import Subnav from './Subnav'





const Nav = props => {
  const {
    className,
    isOpen,
    items,
  } = props

  return (
    <nav
      aria-expanded={isOpen}
      aria-hidden={!isOpen}
      className={className}>
      <ul>
        {items.map(item => {
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
                  {...props}
                  {...item}
                  isFocusable={isOpen} />
              )}

              {!subnav && (
                <NavLink
                  {...props}
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
  className: '',
  isOpen: true,
}

Nav.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  items: PropTypes.array.isRequired,
}





export default Nav
