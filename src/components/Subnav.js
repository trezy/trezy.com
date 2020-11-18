// Module imports
import React, {
	useState,
} from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import NavLink from 'components/NavLink'





const Subnav = props => {
	const {
		condition,
		iconOnly,
		id,
		isOpen,
		onClose,
		onOpen,
		subnav,
	} = props

	const [subkeys] = useState({})

	if (condition && !condition(props)) {
		return null
	}

	const passableProps = { ...props }

	delete passableProps.className
	delete passableProps.icon
	delete passableProps.iconComponent

	const className = typeof props.className === 'function' ? props.className(props) : props.className
	const icon = typeof props.icon === 'function' ? props.icon(props) : props.icon
	const iconComponent = typeof props.iconComponent === 'function' ? props.iconComponent(props) : props.iconComponent
	const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(props) : props.iconPrefix
	const label = typeof props.label === 'function' ? props.label(props) : props.label
	const title = typeof props.title === 'function' ? props.title(props) : props.title

	let titleComponent = null

	if (!iconOnly) {
		if (title instanceof Symbol) {
			titleComponent = title
		} else {
			titleComponent = (
				<span>
					{title}
				</span>
			)
		}
	}

	const onToggle = () => {
		if (isOpen) {
			onClose()
		} else {
			onOpen()
		}
	}

	return (
		<li
			className={className}
			key={title}>
			<nav
				aria-label={label || title}
				className="subnav"
				key={id}>
				<NavLink
					aria-label={`${isOpen ? 'Close' : 'Expand'} ${label || title} navigation`}
					aria-pressed={isOpen}
					icon={icon}
					iconComponent={iconComponent}
					iconPrefix={iconPrefix}
					onClick={onToggle}
					title={title} />

				<ul
					aria-expanded={isOpen}
					hidden={!isOpen}>
					{subnav.map((item, index) => {
						if (item.condition && !item.condition(props)) {
							return null
						}

						const itemProps = {
							...passableProps,
							...item,
						}
						let subkey = item.key || subkeys[index]

						if (!subkey) {
							subkeys[index] = uuid()
							subkey = subkeys[index]
						}

						return (
							<li>
								<NavLink
									{...itemProps}
									key={subkey} />
							</li>
						)
					})}
				</ul>
			</nav>
		</li>
	)
}

Subnav.defaultProps = {
	className: '',
	condition: null,
	icon: null,
	iconComponent: null,
	iconOnly: false,
	iconPrefix: null,
	label: null,
	onClose: () => {},
	onOpen: () => {},
}

Subnav.propTypes = {
	className: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	condition: PropTypes.func,
	icon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	iconComponent: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func,
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
			PropTypes.node,
		])),
	]),
	iconOnly: PropTypes.bool,
	iconPrefix: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	label: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	onClose: PropTypes.func,
	onOpen: PropTypes.func,
	subnav: PropTypes.array.isRequired,
	title: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
}





export default Subnav
