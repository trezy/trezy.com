// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'





function NavLink(props) {
	const {
		disabled,
		extraProps,
		href,
		icon,
		iconOnly,
		iconPrefix,
		onClick,
		title,
	} = props

	let iconComponent = icon

	if (typeof icon === 'function') {
		iconComponent = icon()
	} else {
		iconComponent = (
			<FontAwesomeIcon
				aria-hidden={!iconOnly}
				fixedWidth
				icon={[iconPrefix, icon]}
				title={title} />
		)
	}

	const isExternalLink = useMemo(() => /https?:\/\//gui.test(href), [href])

	const handleClick = useCallback(event => {
		if (onClick) {
			onClick(event, props)
		}
	}, [])

	if (onClick) {
		return (
			<button
				{...extraProps}
				className={classnames({ iconic: iconOnly })}
				disabled={disabled}
				onClick={handleClick}>
				{iconComponent}
				{Boolean(title) && (
					<span>{title}</span>
				)}
			</button>
		)
	}

	if (!onClick && isExternalLink) {
		return (
			<ExternalLink
				{...extraProps}
				className={classnames({
					disabled,
					iconic: iconOnly,
				})}
				href={href}
				target="_blank">
				{iconComponent}
				{Boolean(title) && (
					<span className={classnames({
						'screen-reader-only': iconOnly,
					})}>
						{title}
					</span>
				)}
			</ExternalLink>
		)
	}

	return (
		<Link href={href}>
			<a
				{...extraProps}
				className={classnames({
					disabled,
					iconic: iconOnly,
				})}>
				{iconComponent}
				{Boolean(title) && (
					<span>{title}</span>
				)}
			</a>
		</Link>
	)
}

NavLink.defaultProps = {
	disabled: false,
	extraProps: {},
	href: '',
	icon: null,
	iconOnly: false,
	iconPrefix: 'fas',
	onClick: null,
}

NavLink.propTypes = {
	disabled: PropTypes.bool,
	extraProps: PropTypes.object,
	href: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	iconOnly: PropTypes.bool,
	iconPrefix: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string.isRequired,
}

export { NavLink }
