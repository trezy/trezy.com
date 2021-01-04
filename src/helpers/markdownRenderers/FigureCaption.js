// Module imports
import PropTypes from 'prop-types'





function FigureCaption(props) {
	const { children } = props

	return (
		<figcaption>
			{children}
		</figcaption>
	)
}

FigureCaption.propTypes = {
	children: PropTypes.node.isRequired,
}

export { FigureCaption }
