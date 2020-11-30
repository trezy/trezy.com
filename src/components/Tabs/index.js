// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Tab } from 'components/Tabs/Tab'





function Tabs(props) {
	const {
		activeTab,
		onClick,
		tabs,
	} = props

	return (
		<div className="tabs">
			{tabs.map(tabName => (
				<Tab
					isActive={activeTab === tabName}
					key={tabName}
					name={tabName}
					onClick={onClick} />
			))}
		</div>
	)
}

Tabs.propTypes = {
	activeTab: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export { Tabs }
