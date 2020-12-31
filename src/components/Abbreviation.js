// Module imports
import PropTypes from 'prop-types'





function Abbreviation(props) {
	const {
		children,
		title,
	} = props

	return (
		<abbr title={title}>{children}</abbr>
	)
}

Abbreviation.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
}

export { Abbreviation }
