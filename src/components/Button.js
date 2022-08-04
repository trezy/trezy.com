// Module imports
import { useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





export function Button(props) {
	const {
		children,
		className,
		isStyled,
		type,
	} = props

	const passableProps = { ...props }
	delete passableProps.children
	delete passableProps.className
	delete passableProps.isStyled

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
			<span>{children}</span>
		</button>
	)
}

Button.defaultProps = {
	className: '',
	isStyled: true,
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	isStyled: PropTypes.bool,
	type: PropTypes.oneOf([
		'button',
		'submit',
	]),
}
