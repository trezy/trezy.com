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
}

TabPanel.propTypes = {
	children: PropTypes.node,
	tabID: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
}
