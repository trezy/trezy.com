// Module imports
import {
	Children,
	cloneElement,
	createContext,
	useCallback,
	useContext,
	useId,
	useMemo,
	useState,
} from 'react'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../Button.js'
import { TabPanel } from './TabPanel.js'





const TabsContext = createContext({
	currentTab: null,
	id: null,
})

export function Tabs(props) {
	const { children } = props
	const id = useId()

	const defaultTab = useMemo(() => {
		const defaultTabIndex = Children
			.map(children, child => Boolean(child?.props.isDefault))
			.indexOf(true)

		if (defaultTabIndex === -1) {
			return null
		}

		return `${id}-${defaultTabIndex}`
	}, [
		children,
		id,
	])

	const [currentTab, setCurrentTab] = useState(defaultTab)

	const toggleTab = useCallback(tabID => () => {
		setCurrentTab(previousState => {
			if (previousState === tabID) {
				return null
			}

			return tabID
		})
	}, [setCurrentTab])

	const {
		tabPanels,
		tabs,
	} = useMemo(() => {
		const tabs = []
		const tabPanels = []

		Children.forEach(children, (child, index) => {
			if (child === null) {
				return null
			}

			if (child.type !== TabPanel) {
				throw new Error('<Tabs> components may only have <TabPanels> as immediate children; all other children will cause this error.')
			}

			const tabID = `${id}-${index}`

			tabs.push((
				<Button
					key={index}
					aria-controls={tabID}
					className={classnames({
						'is-active': tabID === currentTab,
					})}
					isStyled={false}
					onClick={toggleTab(tabID)}
					role={'tab'}>
					{child.props.title}

					<FontAwesomeIcon
						fixedWidth
						icon={faCaretDown}
						rotation={tabID === currentTab ? 180 : 0} />
				</Button>
			))

			tabPanels.push(cloneElement(child, {
				...child.props,
				id: tabID,
				key: tabID,
			}))
		})

		return {
			tabPanels,
			tabs,
		}
	}, [
		children,
		currentTab,
		toggleTab,
		id,
	])

	const contextValue = useMemo(() => {
		return {
			currentTab,
			id,
		}
	}, [
		currentTab,
		id,
	])

	return (
		<TabsContext.Provider value={contextValue}>
			<div className={'new-tabs'}>
				<div role={'tablist'}>
					{tabs}
				</div>

				{tabPanels}
			</div>
		</TabsContext.Provider>
	)
}

Tabs.defaultProps = {
	children: null,
}

Tabs.propTypes = {
	children: PropTypes.node,
}

export function useTabsContext() {
	return useContext(TabsContext)
}
