// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Switch } from 'components/Switch'





function NotificationsSettingRow(props) {
	const {
		disabled = false,
		label,
		notifications,
		onChange,
		setting,
	} = props

	return (
		<tr>
			<th scope="row">
				<label>{label}</label>
			</th>

			<td>
				<Switch
					isOn={notifications[setting]?.textMessage} />
				{/* <Input
					disabled={disabled}
					name={`${setting}:textMessage`}
					onChange={onChange}
					type="checkbox"
					value={notifications[setting]?.textMessage} /> */}
			</td>

			<td>
				<Switch
					isOn={notifications[setting]?.email} />
				{/* <Input
					disabled={disabled}
					name={`${setting}:email`}
					onChange={onChange}
					type="checkbox"
					value={notifications[setting]?.email} /> */}
			</td>
		</tr>
	)
}

NotificationsSettingRow.propTypes = {
	disabled: PropTypes.bool,
	label: PropTypes.string.isRequired,
	notifications: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	setting: PropTypes.string.isRequired,
}

export { NotificationsSettingRow }
