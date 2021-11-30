// Module imports
import PropTypes from 'prop-types'





export default function Image(props) {
	return (
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
}

Image.propTypes = {
	alt: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
}
