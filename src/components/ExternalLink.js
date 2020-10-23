// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const ExternalLink = props => (
  <a
    {...props}
    rel={`noopener noreferrer ${props.rel}`}
    target="_blank">
    {props.children}
  </a>
)

ExternalLink.defaultProps = {
  rel: '',
}

ExternalLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf([
      PropTypes.element,
      PropTypes.node,
    ]),
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
  rel: PropTypes.string,
}





export default ExternalLink
