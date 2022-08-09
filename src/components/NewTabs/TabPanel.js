// Module imports
import PropTypes from 'prop-types'





// Local imports
import { useTabsContext } from './Tabs.js'





export function TabPanel(props) {
	const {
		children,
		className,
		id,
	} = props
	const { currentTab } = useTabsContext()

	return (
		<div
			className={className}
			hidden={id !== currentTab}
			role={'tabpanel'}>
			{children}
		</div>
	)
}

TabPanel.defaultProps = {
	children: null,
	className: '',
}

TabPanel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string.isRequired,
}
