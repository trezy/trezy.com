// Module imports
import {
	useCallback,
	useState,
} from 'react'
import dynamic from 'next/dynamic'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { Loading } from 'components/Loading'
import { Tabs } from 'components/Tabs'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





// Dynamic components
const ProfileSettings = dynamic(
	() => import('components/Profile/Settings/ProfileSettings').then(mod => mod.ProfileSettings),
	{ loading: () => <Loading /> },
)





// Local constants
const TABS = {
	'Profile': <ProfileSettings />,
}
const TAB_NAMES = Object.keys(TABS)





function Settings() {
	const [activeTab, setActiveTab] = useState(TAB_NAMES[0])

	const handleTabClick = useCallback(tabName => setActiveTab(tabName), [setActiveTab])

	return (
		<PageWrapper
			breadcrumbs={[
				['Profile', '/profile'],
				['Settings', '/profile/settings'],
			]}
			title="Settings">
			<RequireAuthentication>
				<Tabs
					activeTab={activeTab}
					onClick={handleTabClick}
					tabs={TAB_NAMES} />

				{TABS[activeTab]}
			</RequireAuthentication>
		</PageWrapper>
	)
}





export default Settings
