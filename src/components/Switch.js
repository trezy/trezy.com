// Local imports
import PropTypes from 'prop-types'





function Switch(props) {
	const { on } = props

	return (
		<div className="switch">
			<input
				checked={on}
				type="checkbox" />
		</div>
	)
}

Switch.propTypes = {
	on: PropTypes.bool.isRequired,
}

export { Switch }
