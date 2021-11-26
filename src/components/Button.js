// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





export default function Button(props) {
	const {
		children,
		className,
		icon,
		iconPrefix,
		type,
	} = props

	const passableProps = { ...props }
	delete passableProps.children
	delete passableProps.className
	delete passableProps.icon
	delete passableProps.iconPrefix

	let iconComponent = icon

	if (typeof iconComponent === 'function') {
		iconComponent = iconComponent(props)
	}

	if (typeof iconComponent === 'string') {
		iconComponent = (
			<FontAwesomeIcon
				aria-hidden
				fixedWidth
				icon={[(iconPrefix || 'fas'), icon]} />
		)
	}

	return (
		// We're disabling the required type linter for the next line because the
		// `type` attribute is enforced by the proptypes
		// eslint-disable-next-line react/button-has-type
		<button
			className={classnames('button', className)}
			type={type}
			{...passableProps}>
			{iconComponent}
			<span>{children}</span>
		</button>
	)
}

Button.defaultProps = {
	className: '',
	icon: null,
	iconPrefix: 'fas',
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.string,
	]),
	iconPrefix: PropTypes.string,
	type: PropTypes.oneOf([
		'button',
		'submit',
	]),
}
