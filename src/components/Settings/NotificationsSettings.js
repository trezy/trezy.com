// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import {
	faEnvelope,
	faMobileScreenButton,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Local imports
import { Button } from 'components/Button'
import { NotificationsSettingRow } from 'components/Settings/NotificationsSettingRow'
import { useAuth } from 'contexts/AuthContext'





export function NotificationsSettings() {
	const {} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [notifications, setNotifications] = useState('')

	const handleStateChange = useCallback(({ target }) => {
		const {
			name,
			value,
		} = target

		setNotifications(previousValue => ({
			...previousValue,
			[name]: value,
		}))
	}, [setNotifications])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		// setIsSaving(true)

		// try {
		// 	await updateProfile({
		// 		bio,
		// 		displayName,
		// 		website,
		// 	})
		// 	setIsSaved(true)
		// } catch (error) {
		// 	setIsSaved(false)
		// }

		// setIsSaving(false)
	}, [
		notifications,
	])

	useEffect(() => {
		// if (profile) {
		// 	if (!bio) {
		// 		setBio(profile.bio)
		// 	}

		// 	if (!displayName) {
		// 		setDisplayName(profile.displayName)
		// 	}

		// 	if (!website) {
		// 		setWebsite(profile.website)
		// 	}
		// }
	}, [])

	return (
		<section className="block">
			<form onSubmit={handleSubmit}>
				<header>Notifications For Readers</header>

				<table>
					<thead>
						<tr>
							<th scope="column">
								Send me a notification when...
							</th>

							<th scope="column">
								<FontAwesomeIcon
									fixedWidth
									icon={faMobileScreenButton} />
								Mobile
							</th>

							<th scope="column">
								<FontAwesomeIcon
									fixedWidth
									icon={faEnvelope} />
								Email
							</th>
						</tr>
					</thead>

					<tbody>
						<NotificationsSettingRow
							disabled={isSaving}
							onChange={handleStateChange}
							label="A new article is posted"
							notifications={notifications}
							setting="New Article" />
					</tbody>
				</table>

				<div className="field">
					<menu type="toolbar">
						<Button type="submit">
							Save
						</Button>
					</menu>
				</div>
			</form>
		</section>
	)
}
