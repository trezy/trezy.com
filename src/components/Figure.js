// Module imports
import PropTypes from 'prop-types'





function Figure(props) {
	const { children } = props

	return (
		<figure>
			{children}
		</figure>
	)
}

Figure.propTypes = {
	children: PropTypes.node.isRequired,
}

export { Figure }
