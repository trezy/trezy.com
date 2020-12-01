// Component imports
import Settings from 'components/Settings'





function SettingsPage(props) {
	const { panel } = props

	return (
		<Settings defaultPanel={panel} />
	)
}

export async function getServerSideProps(context) {
	const panel = context.params.panel?.[0]

	if (!panel || !['profile', 'account', 'password', 'notifications'].includes(panel)) {
		return {
			redirect: {
        destination: '/settings/profile',
        permanent: true,
      },
		}
	}

	return {
		props: {
			panel,
		},
	}
}





export default SettingsPage
