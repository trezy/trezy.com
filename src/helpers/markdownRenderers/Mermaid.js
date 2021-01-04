// Module imports
import {
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Local imports
import { mdastNodeToString } from 'helpers/mdastNodeToString'





// Local variables
let mermaid = null





function Mermaid(props) {
	const {
		node,
	} = props
	const [svg, setSVG] = useState(null)
	const [id] = useState(`mermaid-${uuid()}`)

	useEffect(async () => {
		if (!mermaid) {
			mermaid = await import('mermaid')
			mermaid.initialize({ startOnLoad: false })
		}

		mermaid.render(id, mdastNodeToString(node), renderedSVG => setSVG(renderedSVG))
	}, [node])

	return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
	)
}

Mermaid.propTypes = {
	node: PropTypes.object.isRequired,
}

export { Mermaid }
