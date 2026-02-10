// Module imports
import PropTypes from 'prop-types'





export function Figure(props) {
	const {
		caption = '',
		className = '',
		imageDescription = null,
		imageURL = null,
	} = props

	return (
		<figure className={className}>
			{Boolean(imageURL) && (
				<img
					alt={imageDescription}
					src={imageURL} />
			)}

			{Boolean(caption) && (
				<figcaption>
					{caption}
				</figcaption>
			)}
		</figure>
	)
}

Figure.propTypes = {
	caption: PropTypes.string,
	className: PropTypes.string,
	imageDescription: PropTypes.string,
	imageURL: PropTypes.string,
}
