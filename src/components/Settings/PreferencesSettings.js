// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import {
	RadioGroup,
	RadioOption,
} from 'components/RadioGroup'
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'
import Input from 'components/Input'





export function PreferencesSettings(props) {
	const { motionSettings } = props
	const {
		isLoaded,
		settings,
		updateSettings,
	} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [theme, setTheme] = useState('')

	const handleStateChange = useCallback(setter => ({ target }) => setter(target.value), [])
	const handleThemeChange = useCallback(handleStateChange(setTheme), [
		handleStateChange,
		setTheme,
	])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		setIsSaving(true)

		try {
			await Promise.all([
				updateSettings({ theme }),
			])
			setIsSaved(true)
		} catch (error) {
			setIsSaved(false)
		}

		setIsSaving(false)
	}, [
		theme,
		updateSettings,
		setIsSaved,
		setIsSaving,
	])

	useEffect(() => {
		if (settings) {
			if (!theme) {
				setTheme(settings.theme)
			}
		}
	}, [
		settings,
		theme,
		setTheme,
	])

	const isDirty = theme !== settings?.theme

	return (
		<motion.section
			className="block"
			{...motion}>
			<form onSubmit={handleSubmit}>
				<div className="field horizontal">
					<label>Theme</label>

					<RadioGroup
						disabled={!isLoaded || isSaving}
						id="theme"
						onChange={handleThemeChange}
						value={theme}>
						<RadioOption
							title="System"
							value="system" />

						<RadioOption
							title="Light"
							value="light" />

						<RadioOption
							title="Dark"
							value="dark" />
					</RadioGroup>
				</div>

				<div className="field">
					<menu type="toolbar">
						<Button
							disabled={!isDirty || !isLoaded || isSaving}
							type="submit">
							Save
						</Button>
					</menu>
				</div>
			</form>
		</motion.section>
	)
}
