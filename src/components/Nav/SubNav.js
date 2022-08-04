// Module imports
import {
	useCallback,
	useId,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





// Local imports
import { NavLink } from 'components/Nav/NavLink'
import { useNav } from 'components/Nav/Nav'





function SubNav(props) {
	const {
		children,
		className,
		icon,
		label,
		title,
	} = props
	const {
		openSubNav,
		toggleSubNav,
	} = useNav()
	const id = useId()

	const isOpen = (openSubNav === id)

	const handleToggle = useCallback(() => {
		toggleSubNav(id)
	}, [
		id,
		toggleSubNav,
	])

	return (
		<li
			className={className}
			key={title}>
			<nav
				aria-label={label || title}
				className="subnav">
				<NavLink
					extraProps={{
						'aria-label': `${isOpen ? 'Close' : 'Expand'} ${label || title} navigation`,
						'aria-pressed': isOpen,
					}}
					icon={icon}
					onClick={handleToggle}
					title={title} />

				<ul
					aria-expanded={isOpen}
					hidden={!isOpen}>
					{children}
				</ul>
			</nav>
		</li>
	)
}

SubNav.defaultProps = {
	className: '',
	icon: null,
	label: '',
	title: '',
}

SubNav.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	label: PropTypes.string,
	tabIndex: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	title: PropTypes.string,
}

export { SubNav }
