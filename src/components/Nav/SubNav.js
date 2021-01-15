// Module imports
import {
	useCallback,
	useEffect,
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
		iconPrefix,
		label,
		title,
	} = props
	const {
		openSubNav,
		toggleSubNav,
	} = useNav()
	const [id] = useState(uuid())

	const isOpen = (openSubNav === id)

	const handleToggle = useCallback(() => {
		toggleSubNav(id)
	}, [toggleSubNav])

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
					iconPrefix={iconPrefix}
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
	iconPrefix: 'fas',
	label: '',
	title: '',
}

SubNav.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	iconPrefix: PropTypes.string,
	label: PropTypes.string,
	title: PropTypes.string,
}

export { SubNav }
