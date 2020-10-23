// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const Image = props => (
	<div className="image-wrapper">
		<div
			className="image-background"
			style={{ backgroundImage: `url(${props.src})` }} />

		<img
			{...props}
			alt={props.alt}
			src={props.src} />
	</div>
)

Image.propTypes = {
	alt: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
}





export default Image
