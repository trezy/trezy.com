// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const List = props => {
	const {
		children,
		ordered,
		start,
	} = props
	const attributes = {
		className: ordered ? 'numbered' : 'bulleted',
	}

	if (start !== null && start !== 1 && start !== undefined) {
		attributes.start = start.toString()
	}

	const listElementType = ordered ? 'ol' : 'ul'

	return React.createElement(listElementType, attributes, children)
}

List.defaultProps = {
	children: null,
	start: 1,
}

List.propTypes = {
	children: PropTypes.node,
	ordered: PropTypes.bool.isRequired,
	start: PropTypes.number,
}





export { List }
