// Module imports
import { useEffect } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Abbreviation } from 'components/Abbreviation.js'
import { Changelog } from 'helpers/markdownRenderers/Changelog.js'
import { DITAA } from 'helpers/markdownRenderers/DITAA.js'
import { Figure } from 'helpers/markdownRenderers/Figure.js'
import { FigureCaption } from 'helpers/markdownRenderers/FigureCaption.js'
import { Mermaid } from 'helpers/markdownRenderers/Mermaid.js'
import { Notice } from 'helpers/markdownRenderers/Notice.js'
import { PlantUML } from 'helpers/markdownRenderers/PlantUML.js'
import Codepen from 'components/Codepen.js'
import Tweet from 'components/Tweet.js'





// Local constants
const availableDirectives = {
	containerDirective: {
		changelog: Changelog,
		ditaa: DITAA,
		mermaid: Mermaid,
		notice: Notice,
		plantuml: PlantUML,
		figure: Figure,
	},
	leafDirective: {
		codepen: Codepen,
		figcaption: FigureCaption,
		tweet: Tweet,
	},
	textDirective: {
		abbr: Abbreviation,
	},
}





const Directive = props => {
	const {
		attributes = {},
		children = null,
		name,
		node,
	} = props

	const DirectiveComponent = availableDirectives[node.type]?.[name.toLowerCase()]

	if (!DirectiveComponent) {
		return null
	}

	return (
		<DirectiveComponent
			{...attributes}
			node={node}>
			{children}
		</DirectiveComponent>
	)
}

Directive.propTypes = {
	attributes: PropTypes.object,
	children: PropTypes.node,
	name: PropTypes.string.isRequired,
	node: PropTypes.object.isRequired,
}





export { Directive }
