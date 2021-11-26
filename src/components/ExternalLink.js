// Module imports
import PropTypes from 'prop-types'





export function ExternalLink(props) {
	return (
		<a
			{...props}
			rel={`noopener noreferrer ${props.rel}`}
			target="_blank">
			{props.children}
		</a>
	)
}

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
