// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { Link } from '../routes'





// Local constants
const allowedLinkKeys = ['href', 'params', 'route', 'target']





const NavLink = props => {
  const {
    disabled,
    href,
    isFocusable,
    title,
  } = props

  const linkProps = Object.entries(props).reduce((accumulator, [itemKey, itemValue]) => {
    if (allowedLinkKeys.includes(itemKey)) {
      accumulator[itemKey] = itemValue
    }

    return accumulator
  }, {})

  return (
    <Link {...linkProps}>
      <a
        className={disabled ? 'disabled' : ''}
        target={/https?:\/\//gui.test(href) ? '_blank' : null}
        tabIndex={isFocusable ? null : '-1'}> {/* eslint-disable-line jsx-a11y/no-noninteractive-tabindex */}
        <span>{title}</span>
      </a>
    </Link>
  )
}

NavLink.defaultProps = {
  disabled: false,
  href: null,
  isFocusable: true,
}

NavLink.propTypes = {
  disabled: PropTypes.bool,
  href: PropTypes.string,
  isFocusable: PropTypes.bool,
  title: PropTypes.string.isRequired,
}





export default NavLink
