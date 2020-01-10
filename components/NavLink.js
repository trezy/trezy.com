// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import ExternalLink from './ExternalLink'





// Local constants
const allowedLinkKeys = ['href', 'params', 'route', 'target']





const NavLink = props => {
  const {
    extraProps,
    iconOnly,
    isFocusable,
    onClick,
  } = props

  const Router = useRouter()

  const className = typeof props.className === 'function' ? props.className(props) : props.className
  const disabled = typeof props.disabled === 'function' ? props.disabled(props) : props.disabled
  const href = typeof props.href === 'function' ? props.href(props) : props.href
  const icon = typeof props.icon === 'function' ? props.icon(props) : props.icon
  const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(props) : props.iconPrefix
  const title = typeof props.title === 'function' ? props.title(props) : props.title

  let iconComponent = null
  let titleComponent = null

  if (props.iconComponent) {
    if (typeof props.iconComponent === 'function') {
      iconComponent = props.iconComponent(props)
    } else {
      iconComponent = props.iconComponent
    }
  } else if (icon) {
    iconComponent = (
      <FontAwesomeIcon
        aria-hidden={!iconOnly}
        fixedWidth
        icon={[(iconPrefix || 'fas'), icon]}
        title={title} />
    )
  }

  if (title instanceof Symbol) {
    titleComponent = title
  } else {
    titleComponent = (
      <span className={classnames({ 'screen-reader-only': iconOnly })}>
        {title}
      </span>
    )
  }

  if (onClick) {
    return (
      <button
        {...extraProps}
        className={classnames(className, { iconic: iconOnly })}
        disabled={disabled}
        onClick={event => onClick(event, {
          ...props,
          Router,
        })}
        tabIndex={isFocusable ? null : '-1'}
        type="button">
        {iconComponent}

        {titleComponent}
      </button>
    )
  }

  const linkProps = Object.entries(props).reduce((accumulator, [itemKey, itemValue]) => {
    if (allowedLinkKeys.includes(itemKey)) {
      accumulator[itemKey] = itemValue
    }

    return accumulator
  }, {})


  if (/https?:\/\//gui.test(href)) {
    return (
      <ExternalLink
        {...extraProps}
        {...linkProps}
        className={classnames(className, 'button', {
          disabled,
          iconic: iconOnly,
        })}
        tabIndex={isFocusable ? null : '-1'}>
        {iconComponent}

        {titleComponent}
      </ExternalLink>
    )
  }

  return (
    <Link {...linkProps}>
      <a
        {...extraProps}
        className={classnames(className, 'button', {
          disabled,
          iconic: iconOnly,
        })}
        tabIndex={isFocusable ? null : '-1'}> {/* eslint-disable-line jsx-a11y/no-noninteractive-tabindex */}
        {iconComponent}

        {titleComponent}
      </a>
    </Link>
  )
}

NavLink.defaultProps = {
  className: '',
  disabled: false,
  extraProps: {},
  href: null,
  icon: null,
  iconComponent: null,
  iconOnly: false,
  iconPrefix: null,
  isFocusable: true,
  onClick: null,
}

NavLink.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  disabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  extraProps: PropTypes.object,
  href: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  iconComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  iconOnly: PropTypes.bool,
  iconPrefix: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  isFocusable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  onClick: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
}





export default NavLink
