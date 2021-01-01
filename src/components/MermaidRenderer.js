// Module imports
import {
	useEffect,
	useState,
} from 'react'
import mdastToString from 'mdast-util-to-string'
import PropTypes from 'prop-types'





// Local variables
let mermaid = null





function MermaidRenderer(props) {
	const {
		children,
		node,
	} = props
	const [svg, setSVG] = useState(null)

	useEffect(async () => {
		if (!mermaid) {
			mermaid = await import('mermaid')
			mermaid.initialize({ startOnLoad: false })
		}

		mermaid.render('foo', mdastToString(node), renderedSVG => setSVG(renderedSVG))
	}, [])

	return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
	)
}

MermaidRenderer.propTypes = {
	children: PropTypes.node.isRequired,
}

export { MermaidRenderer }
