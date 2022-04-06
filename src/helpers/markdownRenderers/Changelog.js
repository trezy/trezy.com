// Module imports
import PropTypes from 'prop-types'





function Changelog(props) {
	const { children } = props

	return (
		<details className="notice">
			<summary>{'Changelog'}</summary>
			{children}
		</details>
	)
}

Changelog.propTypes = {
	children: PropTypes.node.isRequired,
}

export { Changelog }
