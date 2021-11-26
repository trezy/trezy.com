// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





export function Alert(props) {
	const {
		children,
		type,
	} = props
	const passableProps = { ...props }

	let icon = null

	delete passableProps.children

	switch (type) {
		case 'danger':
			icon = 'exclamation-triangle'
			break

		case 'warning':
			icon = 'exclamation-circle'
			break

		default:
			icon = 'info-circle'
			break
	}

	return (
		<div
			className={classnames('alert', type)}
			{...passableProps}>
			<FontAwesomeIcon
				fixedWidth
				icon={icon} />

			{children}
		</div>
	)
}

Alert.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf([
			PropTypes.element,
			PropTypes.node,
		]),
		PropTypes.element,
		PropTypes.node,
	]).isRequired,
	type: PropTypes.string.isRequired,
}
