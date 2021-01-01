// Module imports
import {
	useEffect,
	useState,
} from 'react'
import mdastToString from 'mdast-util-to-string'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Local variables
let mermaid = null





function MermaidRenderer(props) {
	const {
		children,
		node,
	} = props
	const [svg, setSVG] = useState(null)
	const [id] = useState(uuid())

	useEffect(async () => {
		if (!mermaid) {
			mermaid = await import('mermaid')
			mermaid.initialize({ startOnLoad: false })
		}

		mermaid.render(id, mdastToString(node), renderedSVG => setSVG(renderedSVG))
	}, [])

	return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
	)
}

MermaidRenderer.propTypes = {
	children: PropTypes.node.isRequired,
}

export { MermaidRenderer }
