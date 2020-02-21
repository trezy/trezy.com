// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import ExternalLink from './ExternalLink'





const NavLink = props => {
  const {
    extraProps,
    iconOnly,
    isFocusable,
    onClick,
    target,
  } = props

  const Router = useRouter()
  const passableProps = {
    ...props,
    Router,
  }

  const className = typeof props.className === 'function' ? props.className(passableProps) : props.className
  const disabled = typeof props.disabled === 'function' ? props.disabled(passableProps) : props.disabled
  const href = typeof props.href === 'function' ? props.href(passableProps) : props.href
  const icon = typeof props.icon === 'function' ? props.icon(passableProps) : props.icon
  const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(passableProps) : props.iconPrefix
  const title = typeof props.title === 'function' ? props.title(passableProps) : props.title

  let iconComponent = null
  let titleComponent = null

  if (props.iconComponent) {
    if (typeof props.iconComponent === 'function') {
      iconComponent = props.iconComponent(passableProps)
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
        onClick={event => onClick(event, passableProps)}
        tabIndex={isFocusable ? null : '-1'}
        type="button">
        {iconComponent}

        {titleComponent}
      </button>
    )
  }

  if (/https?:\/\//gui.test(href)) {
    return (
      <ExternalLink
        {...extraProps}
        className={classnames(className, 'button', {
          disabled,
          iconic: iconOnly,
        })}
        href={href}
        target={target}
        tabIndex={isFocusable ? null : '-1'}>
        {iconComponent}

        {titleComponent}
      </ExternalLink>
    )
  }

  return (
    <Link href={href}>
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
  target: null,
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
  target: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
}





export default NavLink
