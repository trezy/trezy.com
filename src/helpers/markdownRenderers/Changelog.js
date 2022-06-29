// Module imports
import PropTypes from 'prop-types'





// Local imports
import { MDXRenderer } from '../../components/MDXRenderer.js'





function Changelog(props) {
	const { changelog } = props

	return (
		<details className={'notice'}>
			<summary>{'Changelog'}</summary>

			<MDXRenderer source={changelog} />
		</details>
	)
}

Changelog.propTypes = {
	changelog: PropTypes.node.isRequired,
}

export { Changelog }
