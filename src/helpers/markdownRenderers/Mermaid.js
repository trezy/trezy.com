// Module imports
import {
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





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

	useEffect(() => {
		let cancelled = false

		async function renderDiagram() {
			if (!mermaid) {
				const mermaidModule = await import('mermaid')
				mermaid = mermaidModule.default
				mermaid.initialize({ startOnLoad: false })
			}

			try {
				const { svg } = await mermaid.render(id, mdastNodeToString(node))
				if (!cancelled) {
					setSVG(svg)
				}
			} catch (error) {
				console.error('Mermaid render failed:', error)
			}
		}

		renderDiagram()
		return () => { cancelled = true }
	}, [node])

	return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
	)
}

Mermaid.propTypes = {
	node: PropTypes.object.isRequired,
}

export { Mermaid }
