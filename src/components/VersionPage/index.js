'use client'

// Module imports
import {
	useCallback,
	useState,
} from 'react'





// Local imports
import { Dependencies } from './Dependencies'
import { Environment } from './Environment'
import { Git } from './Git'
import { Tabs } from 'components/Tabs'
import { PageContent } from 'components/PageContent.js'





export function VersionPage(props) {
	const [tabs, setTabs] = useState({
		Environment: <Environment {...props} />,
		Git: <Git {...props} />,
		Dependencies: <Dependencies {...props} />,
	})
	const [activeTab, setActiveTab] = useState('Environment')
	const tabNames = Object.keys(tabs)

	const handleTabClick = useCallback(tabName => {
		setActiveTab(tabName)
	}, [setActiveTab])

	return (
		<PageContent title="Version Information">
			<Tabs
				activeTab={activeTab}
				onClick={handleTabClick}
				tabs={tabNames} />

			{tabs[activeTab]}

			{/* <Environment {...props} />
			<Git {...props} />
			<Dependencies {...props} /> */}
		</PageContent>
	)
}
