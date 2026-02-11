// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import { Button } from 'components/Button.js'
import { Switch } from 'components/Switch.js'
import { useAuth } from 'contexts/AuthContext.js'





export function PrivacySettings(props) {
	const { motionSettings } = props
	const {
		isLoaded,
		settings,
		updateSettings,
	} = useAuth()

	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [allowDetailedAnalytics, setAllowDetailedAnalytics] = useState()

	const handleStateChange = useCallback(setter => ({ target }) => {
		let valueKey = 'value'

		if (target.type === 'checkbox') {
			valueKey = 'checked'
		}

		setter(target[valueKey])
	}, [])
	const handleAllowDetailedAnalyticsChange = useCallback(handleStateChange(setAllowDetailedAnalytics), [
		handleStateChange,
		setAllowDetailedAnalytics,
	])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		setIsSaving(true)

		try {
			await Promise.all([
				updateSettings({ allowDetailedAnalytics }),
			])
			setIsSaved(true)
		} catch (error) {
			setIsSaved(false)
		}

		setIsSaving(false)
	}, [
		allowDetailedAnalytics,
		updateSettings,
		setIsSaved,
		setIsSaving,
	])

	useEffect(() => {
		if (settings) {
			if (typeof allowDetailedAnalytics === 'undefined') {
				setAllowDetailedAnalytics(settings.allowDetailedAnalytics)
			}
		}
	}, [
		allowDetailedAnalytics,
		setAllowDetailedAnalytics,
		settings,
	])

	const isDirty = allowDetailedAnalytics !== settings?.allowDetailedAnalytics

	return (
		<motion.section
			className="block"
			{...motionSettings}>
			<form onSubmit={handleSubmit}>
				<div className="field horizontal">
					<label>{'Allow Detailed Analytics'}</label>

					<Switch
						isOn={allowDetailedAnalytics || false}
						onChange={handleAllowDetailedAnalyticsChange} />
				</div>

				<div className="field">
					<menu type="toolbar">
						<Button
							disabled={!isDirty || !isLoaded || isSaving}
							type="submit">
							{'Save'}
						</Button>
					</menu>
				</div>
			</form>
		</motion.section>
	)
}
