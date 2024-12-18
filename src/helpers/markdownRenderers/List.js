// Module imports
import { createElement } from 'react'
import PropTypes from 'prop-types'





export function List(props) {
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

	return createElement(listElementType, attributes, children)
}

List.defaultProps = {
	children: null,
	ordered: false,
	start: 1,
}

List.propTypes = {
	children: PropTypes.node,
	ordered: PropTypes.bool,
	start: PropTypes.number,
}
