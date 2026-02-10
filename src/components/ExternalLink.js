// Module imports
import PropTypes from 'prop-types'





export function ExternalLink({ rel = '', ...rest }) {
	return (
		<a
			{...rest}
			rel={`noopener noreferrer ${rel}`}
			target="_blank">
			{rest.children}
		</a>
	)
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
