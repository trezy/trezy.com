// Module imports
import { useState } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { encodeDiagram } from 'helpers/encodeDiagram'





function Kroki(props) {
	const {
		children,
		type,
	} = props

	const [umlHash] = useState(encodeDiagram(children))

	return (
		<img src={`https://kroki.io/${type}/svg/${umlHash}`} />
	)
}

Kroki.propTypes = {
	children: PropTypes.node.isRequired,
	type: PropTypes.string.isRequired,
}

export { Kroki }
