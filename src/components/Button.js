// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Button(props) {
	const {
		children,
		className,
		icon,
		iconPrefix,
		isStyled,
		type,
	} = props

	const passableProps = { ...props }
	delete passableProps.children
	delete passableProps.className
	delete passableProps.icon
	delete passableProps.iconPrefix
	delete passableProps.isStyled

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

	const compiledClassNames = useMemo(() => {
		return classnames(className, {
			button: isStyled,
		})
	}, [
		className,
		isStyled,
	])

	return (
		// We're disabling the required type linter for the next line because the
		// `type` attribute is enforced by the proptypes
		// eslint-disable-next-line react/button-has-type
		<button
			className={compiledClassNames}
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
	isStyled: true,
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
	isStyled: PropTypes.bool,
	type: PropTypes.oneOf([
		'button',
		'submit',
	]),
}
