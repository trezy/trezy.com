// Module imports
import PropTypes from 'prop-types'
import React from 'react'





import Codepen from '../../components/Codepen'





const Shortcode = props => {
  const {
    attributes,
    children,
    identifier,
  } = props

  const shortcodeComponents = {
    codepen: Codepen,
  }

  const ShortcodeComponent = shortcodeComponents[identifier.toLowerCase()] || (() => null)

  return (
    <ShortcodeComponent {...attributes}>
      {children}
    </ShortcodeComponent>
  )
}

Shortcode.defaultProps = {
  children: null,
}

Shortcode.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node,
  identifier: PropTypes.string.isRequired,
}





export { Shortcode }
