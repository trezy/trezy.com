// Module imports
import {
	faExclamationCircle,
	faExclamationTriangle,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import PropTypes from 'prop-types'





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
			icon = faExclamationTriangle
			break

		case 'warning':
			icon = faExclamationCircle
			break

		default:
			icon = faInfoCircle
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
	children: PropTypes.node.isRequired,
	type: PropTypes.string.isRequired,
}
