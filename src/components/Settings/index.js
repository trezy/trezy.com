// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'





// Component imports
import { AccountSettings } from 'components/Settings/AccountSettings'
import { NotificationsSettings } from 'components/Settings/NotificationsSettings'
import { PreferencesSettings } from 'components/Settings/PreferencesSettings'
import { PrivacySettings } from 'components/Settings/PrivacySettings'
import { ProfileSettings } from 'components/Settings/ProfileSettings'
import { Tabs } from 'components/Tabs'
import { useRemoteConfig } from 'contexts/RemoteConfigContext'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





function Settings(props) {
	const router = useRouter()
	const {
		config: remoteConfig,
	} = useRemoteConfig()
	const [tabs, setTabs] = useState({
		Profile: <ProfileSettings />,
		Preferences: <PreferencesSettings />,
		Privacy: <PrivacySettings />,
		Account: <AccountSettings />,
		// Password: <PasswordSettings />,
	})
	const tabNames = Object.keys(tabs)
	const [activeTab, setActiveTab] = useState(tabNames.find(tabName => {
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

	useEffect(() => {
		setTabs(previousValue => {
			const newValue = { ...previousValue }

			if (remoteConfig?.isNotificationsSettingsEnabled) {
				newValue.Notifications = <NotificationsSettings />
			} else {
				delete newValue.Notifications
			}

			if (newValue.Notifications !== previousValue.Notifications) {
				return newValue
			}

			return previousValue
		})
	}, [
		remoteConfig,
		setTabs,
	])

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
					tabs={tabNames} />

				{tabs[activeTab]}

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
