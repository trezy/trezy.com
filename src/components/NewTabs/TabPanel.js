// Module imports
import PropTypes from 'prop-types'





export function TabPanel(props) {
	const {
		children,
		className,
	} = props

	return (
		<div
			className={className}
			role={'tabpanel'}>
			{children}
		</div>
	)
}

TabPanel.defaultProps = {
	children: null,
}

TabPanel.propTypes = {
	children: PropTypes.node,
	title: PropTypes.string.isRequired,
}
