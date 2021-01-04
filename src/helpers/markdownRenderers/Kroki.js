// Module imports
import { useState } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { encodeDiagram } from 'helpers/encodeDiagram'
import { mdastNodeToString } from 'helpers/mdastNodeToString'





function Kroki(props) {
	const {
		node,
		type,
	} = props

	const [umlHash] = useState(encodeDiagram(mdastNodeToString(node)))

	return (
		<img src={`https://kroki.io/${type}/svg/${umlHash}`} />
	)
}

Kroki.propTypes = {
	node: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
}

export { Kroki }
