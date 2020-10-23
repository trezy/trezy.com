// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'





const Button = props => {
  const {
    children,
    icon,
    iconPrefix,
    type,
  } = props

  const passableProps = { ...props }
  delete passableProps.children
  delete passableProps.icon
  delete passableProps.iconPrefix

  let iconComponent = icon

  if (typeof iconComponent === 'function') {
    iconComponent = iconComponent(props)
  }

  if (typeof iconComponent === 'string') {
    iconComponent = (
      <FontAwesomeIcon
        aria-hidden
        fixedWidth
        icon={[(iconPrefix || 'fas'), icon]} />
    )
  }

  return (
    // We're disabling the required type linter for the next line because the
    // `type` attribute is enforced by the proptypes
    // eslint-disable-next-line react/button-has-type
    <button
      type={type}
      {...passableProps}>
      {iconComponent}
      <span>{children}</span>
    </button>
  )
}

Button.defaultProps = {
  icon: null,
  iconPrefix: 'fas',
  type: 'button',
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  iconPrefix: PropTypes.string,
  type: PropTypes.oneOf([
    'button',
    'submit',
  ]),
}





export default Button
