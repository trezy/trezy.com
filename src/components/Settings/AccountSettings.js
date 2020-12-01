// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'





// Local imports
import {
	RadioGroup,
	RadioOption,
} from 'components/RadioGroup'
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import Input from 'components/Input'





export function AccountSettings() {
	const {
		isLoading,
		profile,
		settings,
		updateProfile,
		updateSettings,
	} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [visibility, setVisibility] = useState('')

	const handleStateChange = useCallback(setter => ({ target }) => setter(target.value), [])
	const handleEmailChange = useCallback(handleStateChange(setEmail), [
		handleStateChange,
		setEmail,
	])
	const handleUsernameChange = useCallback(handleStateChange(setUsername), [
		handleStateChange,
		setUsername,
	])
	const handleVisibilityChange = useCallback(handleStateChange(setVisibility), [
		handleStateChange,
		setVisibility,
	])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		setIsSaving(true)

		try {
			await Promise.all([
				updateProfile({
					username,
					visibility,
				}),
				updateSettings({
					email,
				}),
			])
			setIsSaved(true)
		} catch (error) {
			setIsSaved(false)
		}

		setIsSaving(false)
	}, [
		email,
		username,
		visibility,
	])

	useEffect(() => {
		if (profile) {
			if (!username) {
				setUsername(profile.username)
			}

			if (!visibility) {
				setVisibility(profile.visibility)
			}
		}

		if (settings) {
			if (!email) {
				setEmail(settings.email)
			}
		}
	}, [
		profile,
		settings,
		setEmail,
		setUsername,
		setVisibility,
	])

	const isDirty =
		(username !== profile?.username) ||
		(email !== settings?.email) ||
		(visibility !== profile?.visibility)

	return (
		<section className="block">
			<form onSubmit={handleSubmit}>
				<div className="field horizontal">
					<label>Username</label>

					<Input
						disabled={isLoading || isSaving}
						onChange={handleUsernameChange}
						prefix="@"
						value={username} />
				</div>

				<div className="field horizontal">
					<label>Email</label>

					<Input
						disabled={isLoading || isSaving}
						onChange={handleEmailChange}
						type="email"
						value={email} />
				</div>

				<div className="field horizontal">
					<label>Profile Visibility</label>

					<RadioGroup
						disabled={isLoading || isSaving}
						id="profile-visibility"
						onChange={handleVisibilityChange}
						value={visibility}>
						<RadioOption
							title="Public"
							value="public">
							Your profile will be visible to everybody on Trezy.com, and may appear in search engine results.
						</RadioOption>

						<RadioOption
							title="Unlisted"
							value="unlisted">
							Your profile will be visible to everybody on Trezy.com, but it <em>will not</em> appear in search engine results.
						</RadioOption>

						<RadioOption
							title="Private"
							value="private">
							Your profile will not be visible to anybody but you.
						</RadioOption>
					</RadioGroup>
				</div>

				<div className="field">
					<menu type="toolbar">
						<Button
							disabled={!isDirty || isLoading || isSaving}
							type="submit">
							Save
						</Button>
					</menu>
				</div>
			</form>
		</section>
	)
}
