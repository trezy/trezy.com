// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const ExternalLink = props => (
  <a
    {...props}
    rel="noopener noreferrer"
    target="_blank">
    {props.children}
  </a>
)

ExternalLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}





export default ExternalLink
