// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import Input from 'components/Input'





export function ProfileSettings(props) {
	const { motionSettings } = props
	const {
		profile,
		updateProfile,
	} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [bio, setBio] = useState('')
	const [displayName, setDisplayName] = useState('')
	const [website, setWebsite] = useState('')

	const handleStateChange = useCallback(setter => ({ target }) => setter(target.value), [])
	const handleBioChange = useCallback(handleStateChange(setBio), [
		handleStateChange,
		setBio,
	])
	const handleDisplayNameChange = useCallback(handleStateChange(setDisplayName), [
		handleStateChange,
		setDisplayName,
	])
	const handleWebsiteChange = useCallback(handleStateChange(setWebsite), [
		handleStateChange,
		setWebsite,
	])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		setIsSaving(true)

		try {
			await updateProfile({
				bio,
				displayName,
				website,
			})
			setIsSaved(true)
		} catch (error) {
			setIsSaved(false)
		}

		setIsSaving(false)
	}, [
		bio,
		displayName,
		website,
	])

	useEffect(() => {
		if (profile) {
			if (!bio) {
				setBio(profile.bio)
			}

			if (!displayName) {
				setDisplayName(profile.displayName)
			}

			if (!website) {
				setWebsite(profile.website)
			}
		}
	}, [profile])

	const isDirty =
		(bio !== profile?.bio) ||
		(displayName !== profile?.displayName) ||
		(website !== profile?.website)

	return (
		<motion.section
			className="block"
			{...motion}>
			<form onSubmit={handleSubmit}>
				<div className="field horizontal">
					<label>Display Name</label>
					<Input
						disabled={isSaving}
						onChange={handleDisplayNameChange}
						value={displayName} />
				</div>

				<div className="field horizontal">
					<label>Bio</label>
					<Input
						disabled={isSaving}
						multiline
						onChange={handleBioChange}
						value={bio} />
				</div>

				<div className="field horizontal">
					<label>Website</label>
					<Input
						disabled={isSaving}
						onChange={handleWebsiteChange}
						type="url"
						value={website} />
				</div>

				<div className="field">
					<menu type="toolbar">
						<Button
							disabled={!isDirty}
							type="submit">
							Save
						</Button>
					</menu>
				</div>
			</form>
		</motion.section>
	)
}
