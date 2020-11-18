// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'





const NavLink = props => {
	const {
		extraProps,
		iconOnly,
		onClick,
		target,
	} = props

	const Router = useRouter()
	const passableProps = {
		...props,
		Router,
	}

	const disabled = typeof props.disabled === 'function' ? props.disabled(passableProps) : props.disabled
	const href = typeof props.href === 'function' ? props.href(passableProps) : props.href
	const icon = typeof props.icon === 'function' ? props.icon(passableProps) : props.icon
	const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(passableProps) : props.iconPrefix
	const title = typeof props.title === 'function' ? props.title(passableProps) : props.title

	const isExternalLink = /https?:\/\//gui.test(href)

	let iconComponent = null
	let titleComponent = null

	if (props.iconComponent) {
		if (typeof props.iconComponent === 'function') {
			iconComponent = props.iconComponent(passableProps)
		} else {
			iconComponent = props.iconComponent
		}
	} else if (icon) {
		iconComponent = (
			<FontAwesomeIcon
				aria-hidden={!iconOnly}
				fixedWidth
				icon={[(iconPrefix || 'fas'), icon]}
				title={title} />
		)
	}

	if (!iconOnly) {
		titleComponent = title
	}

	return (
		<>
			{Boolean(onClick) && (
				<button
					{...extraProps}
					className={classnames({ iconic: iconOnly })}
					disabled={disabled}
					onClick={event => onClick(event, passableProps)}>
					{iconComponent}
					{Boolean(titleComponent) && (
						<span>{titleComponent}</span>
					)}
				</button>
			)}

			{(!onClick && isExternalLink) && (
				<ExternalLink
					{...extraProps}
					className={classnames({
						disabled,
						iconic: iconOnly,
					})}
					href={href}
					target={target}>
					{iconComponent}
					{Boolean(titleComponent) && (
						<span>{titleComponent}</span>
					)}
				</ExternalLink>
			)}

			{(!onClick && !isExternalLink) && (
				<Link href={href}>
					<a
						{...extraProps}
						className={classnames({
							disabled,
							iconic: iconOnly,
						})}>
						{iconComponent}
						{Boolean(titleComponent) && (
							<span>{titleComponent}</span>
						)}
					</a>
				</Link>
			)}
		</>
	)
}

NavLink.defaultProps = {
	disabled: false,
	extraProps: {},
	href: null,
	icon: null,
	iconComponent: null,
	iconOnly: false,
	iconPrefix: null,
	onClick: null,
	target: null,
}

NavLink.propTypes = {
	disabled: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.func,
	]),
	extraProps: PropTypes.object,
	href: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	iconComponent: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.element,
	]),
	iconOnly: PropTypes.bool,
	iconPrefix: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	onClick: PropTypes.func,
	target: PropTypes.string,
	title: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
}





export default NavLink
