// Module imports
import PropTypes from 'prop-types'





// Local imports
import { MDXRenderer } from '../../components/MDXRenderer.js'





function Changelog(props) {
	const { changelog } = props

	return (
		<MDXRenderer source={changelog} />
	)
}

Changelog.propTypes = {
	changelog: PropTypes.node.isRequired,
}

export { Changelog }
