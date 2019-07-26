// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
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
    icon,
    iconOnly,
    iconPrefix,
    isFocusable,
    onClick,
    title,
  } = props

  if (onClick) {
    return (
      <button
        disabled={disabled}
        onClick={event => onClick(event, props)}
        tabIndex={isFocusable ? null : '-1'}
        type="button">
        {icon && (
          <FontAwesomeIcon
            aria-hidden={!iconOnly}
            fixedWidth
            icon={[(iconPrefix || 'fas'), icon]}
            title={title} />
        )}

        <span className={classnames({ 'screen-reader-only': iconOnly })}>
          {title}
        </span>
      </button>
    )
  }

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
        {icon && (
          <FontAwesomeIcon
            aria-hidden={!iconOnly}
            fixedWidth
            icon={[(iconPrefix || 'fas'), icon]}
            title={title} />
        )}

        <span className={classnames({ 'screen-reader-only': iconOnly })}>
          {title}
        </span>
      </a>
    </Link>
  )
}

NavLink.defaultProps = {
  disabled: false,
  href: null,
  icon: null,
  iconOnly: false,
  iconPrefix: null,
  isFocusable: true,
  onClick: null,
}

NavLink.propTypes = {
  disabled: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconOnly: PropTypes.bool,
  iconPrefix: PropTypes.string,
  isFocusable: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
}





export default NavLink
