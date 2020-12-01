// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'





// Local imports
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import Input from 'components/Input'





export function PasswordSettings() {
	const {} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [newPasswordAgain, setNewPasswordAgain] = useState('')

	const handleStateChange = useCallback(setter => ({ target }) => setter(target.value), [])
	const handleCurrentPasswordChange = useCallback(handleStateChange(setCurrentPassword), [
		handleStateChange,
		setCurrentPassword,
	])
	const handleNewPasswordChange = useCallback(handleStateChange(setNewPassword), [
		handleStateChange,
		setNewPassword,
	])
	const handleNewPasswordAgainChange = useCallback(handleStateChange(setNewPasswordAgain), [
		handleStateChange,
		setNewPasswordAgain,
	])

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
		currentPassword,
		newPassword,
		newPasswordAgain,
	])

	const isValid =
		Boolean(currentPassword) &&
		Boolean(newPassword) &&
		Boolean(newPasswordAgain) &&
		(newPassword === newPasswordAgain)

	return (
		<section className="block">
			<form onSubmit={handleSubmit}>
				<div className="field horizontal">
					<label>Current Password</label>
					<Input
						disabled={isSaving}
						onChange={handleCurrentPasswordChange}
						value={currentPassword} />
				</div>

				<div className="field horizontal">
					<label>New Password</label>
					<Input
						disabled={isSaving}
						onChange={handleNewPasswordChange}
						value={newPassword} />
				</div>

				<div className="field horizontal">
					<label>New Password (Again)</label>
					<Input
						disabled={isSaving}
						onChange={handleNewPasswordAgainChange}
						value={newPasswordAgain} />
				</div>

				<div className="field">
					<menu type="toolbar">
						<Button
							disabled={!isValid}
							type="submit">
							Save
						</Button>
					</menu>
				</div>
			</form>
		</section>
	)
}
