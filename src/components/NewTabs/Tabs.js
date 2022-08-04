// Module imports
import {
	Children,
	createContext,
	useContext,
	useId,
	useMemo,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../Button.js'
import { TabPanel } from './TabPanel.js'





const TabsContext = createContext({
	id: null,
})

export function Tabs(props) {
	const { children } = props
	const id = useId()

	const tabs = useMemo(() => {
		return Children.map(children, (child, index) => {
			if (child === null) {
				return null
			}

			if (child.type !== TabPanel) {
				throw new Error('<Tabs> components may only have <TabPanels> as immediate children; all other children will cause this error.')
			}

			return (
				<Button
					key={index}
					aria-controls={`${id}-${index}`}
					isStyled={false}
					role={'tab'}>
					{child.props.title}
				</Button>
			)
		})
	}, [
		children,
		id,
	])

	const contextValue = useMemo(() => {
		return { id }
	}, [id])

	return (
		<TabsContext.Provider value={contextValue}>
			<div className={'tabs'}>
				<div role={'tablist'}>
					{tabs}
				</div>

				{children}
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
