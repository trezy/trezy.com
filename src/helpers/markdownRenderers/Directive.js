// Module imports
import { useEffect } from 'react'
import PropTypes from 'prop-types'





// Local imports
import Codepen from 'components/Codepen'
import Tweet from 'components/Tweet'





// Local constants
const availableDirectives = {
	leafDirective: {
		codepen: Codepen,
		tweet: Tweet,
	},
}





const Directive = props => {
	const {
		attributes,
		children,
		name,
		node,
	} = props

	const DirectiveComponent = availableDirectives[node.type]?.[name.toLowerCase()]

	if (!DirectiveComponent) {
		return null
	}

	return (
		<DirectiveComponent {...attributes}>
			{children}
		</DirectiveComponent>
	)
}

Directive.defaultProps = {
	attributes: {},
	children: null,
}

Directive.propTypes = {
	attributes: PropTypes.object,
	children: PropTypes.node,
	name: PropTypes.string.isRequired,
	node: PropTypes.object.isRequired,
}





export { Directive }
