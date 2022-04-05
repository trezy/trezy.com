// Local imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





function Switch(props) {
	const {
		isOn,
		onChange,
	} = props

	return (
		<div className="switch">
			<input
				checked={isOn}
				onChange={onChange}
				type="checkbox" />
		</div>
	)
}

Switch.defaultProps = {
	onChange: () => {},
}

Switch.propTypes = {
	isOn: PropTypes.bool.isRequired,
	onChange: PropTypes.func,
}

export { Switch }
