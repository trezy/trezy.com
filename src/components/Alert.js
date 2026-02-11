// Module imports
import {
	faCircleExclamation,
	faTriangleExclamation,
	faCircleInfo,
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
			icon = faTriangleExclamation
			break

		case 'warning':
			icon = faCircleExclamation
			break

		default:
			icon = faCircleInfo
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
