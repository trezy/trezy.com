// Module imports
import {
	useCallback,
	useId,
	useMemo,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { ExternalLink } from 'components/ExternalLink'
import { useNav } from 'components/Nav/Nav'





function NavLink(props) {
	const {
		disabled,
		extraProps,
		href,
		icon,
		iconOnly,
		onClick,
		title,
	} = props
	const { isOpen } = useNav()
	const id = useId()

	const isExternalLink = useMemo(() => /https?:\/\//gui.test(href), [href])

	const iconComponent = useMemo(() => {
		if (typeof icon === 'function') {
			return icon()
		} else {
			return (
				<FontAwesomeIcon
					aria-hidden={!iconOnly}
					fixedWidth
					icon={icon}
					title={title}
					titleId={id} />
			)
		}
	}, [
		icon,
		iconOnly,
		title,
	])

	const titleComponent = useMemo(() => {
		if (!title) {
			return null
		}

		return (
			<span className={classnames({
				'screen-reader-only': iconOnly,
			})}>
				{title}
			</span>
		)
	}, [
		iconOnly,
		title,
	])

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
				onClick={handleClick}
				tabIndex={isOpen ? null : -1}>
				{iconComponent}
				{titleComponent}
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
				tabIndex={isOpen ? null : -1}
				target="_blank">
				{iconComponent}
				{titleComponent}
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
				})}
				tabIndex={isOpen ? null : -1}>
				{iconComponent}
				{titleComponent}
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
	onClick: null,
}

NavLink.propTypes = {
	disabled: PropTypes.bool,
	extraProps: PropTypes.object,
	href: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	iconOnly: PropTypes.bool,
	onClick: PropTypes.func,
	title: PropTypes.string.isRequired,
}

export { NavLink }
