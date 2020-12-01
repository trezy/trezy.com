// Module imports
import {
	useCallback,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { Loading } from 'components/Loading'
import { Tabs } from 'components/Tabs'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





// Dynamic components
const AccountSettings = dynamic(
	() => import('components/Settings/AccountSettings').then(mod => mod.AccountSettings),
	{ loading: () => <Loading /> },
)
const NotificationsSettings = dynamic(
	() => import('components/Settings/NotificationsSettings').then(mod => mod.NotificationsSettings),
	{ loading: () => <Loading /> },
)
const PasswordSettings = dynamic(
	() => import('components/Settings/PasswordSettings').then(mod => mod.PasswordSettings),
	{ loading: () => <Loading /> },
)
const ProfileSettings = dynamic(
	() => import('components/Settings/ProfileSettings').then(mod => mod.ProfileSettings),
	{ loading: () => <Loading /> },
)





// Local constants
const TABS = {
	'Profile': <ProfileSettings />,
	'Account': <AccountSettings />,
	'Password': <PasswordSettings />,
	'Notifications': <NotificationsSettings />,
}
const TAB_NAMES = Object.keys(TABS)





function Settings(props) {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState(TAB_NAMES.find(tabName => {
		return tabName.toLowerCase() === props.defaultPanel
	}))

	const handleTabClick = useCallback(tabName => {
		setActiveTab(tabName)
		router.push(
			`/settings/${tabName.toLowerCase()}`,
			undefined,
			{ shallow: true },
		)
	}, [setActiveTab])

	return (
		<PageWrapper
			breadcrumbs={[
				['Settings', '/settings'],
				[activeTab, `/${activeTab.toLowerCase()}`],
			]}
			title="Settings">
			<RequireAuthentication>
				<Tabs
					activeTab={activeTab}
					onClick={handleTabClick}
					tabs={TAB_NAMES} />

				{TABS[activeTab]}

				{/* {(!isLoaded(auth) || !isLoaded(user)) && (
					<section className="block">
						<span>Loading...</span>
					</section>
				)}

				{(isLoaded(auth) && isLoaded(user)) && (
					<>
						{isSaved && (
							<Alert
								data-animate
								data-animation="fade-in-from-top"
								data-animation-duration="0.2s"
								type="success">
								Success! Your profile has been updated. <span aria-label="Grinning face emoji" role="img">😁</span>
							</Alert>
						)}

						<section className="block">
							<h3>Connected Accounts</h3>

							<table>
								<thead>
									<tr>
										<th>Provider</th>
										<th>Display Name</th>
										<th>Email</th>
										<th>Actions</th>
									</tr>
								</thead>

								<tbody>
									{auth.providerData.map(providerData => {
										const {
											providerId,
											uid,
										} = providerData

										return (
											<tr key={uid}>
												<td><ProviderIcon {...providerData} /></td>
												<td>{providerData.displayName}</td>
												<td>{providerData.email}</td>
												<td>
													<Button
														className="button primary"
														onClick={() => {}}>
														Disconnect
													</Button>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
					</>
				)} */}
			</RequireAuthentication>
		</PageWrapper>
	)
}





export default Settings
