// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const Button = props => {
  const { children } = props

  const passableProps = { ...props }
  delete passableProps.children

  return (
    // We're disabling the required type linter for the next line because the
    // `type` attribute is enforced by the proptypes
    // eslint-disable-next-line react/button-has-type
    <button {...passableProps}>
      <span>{children}</span>
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
}





export default Button
