// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const Image = props => {
  const {
    alt,
    title,
    src,
  } = props

  if (!alt && !title) {
    console.error('Images must have an alt and/or title attribute.')
  }

  return (
    <img
      alt={alt || title}
      src={src}
      title={title || alt} />
  )
}

Image.defaultProps = {
  alt: null,
  // originalNode: null,
  title: null,
}

Image.propTypes = {
  alt: PropTypes.string,
  // originalNode: PropTypes.object,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
}





export { Image }
