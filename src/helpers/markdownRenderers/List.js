// Module imports
import { createElement } from 'react'
import PropTypes from 'prop-types'





export function List(props) {
	const {
		children = null,
		ordered = false,
		start = 1,
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

List.propTypes = {
	children: PropTypes.node,
	ordered: PropTypes.bool,
	start: PropTypes.number,
}
