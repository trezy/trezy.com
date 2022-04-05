// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





export default function ProviderIcon(props) {
	const { providerId } = props

	let iconType = null

	switch (providerId) {
		case 'google.com':
			iconType = 'google'
			break

		case 'twitter.com':
			iconType = 'twitter'
			break
	}

	return (
		<FontAwesomeIcon
			fixedWidth
			icon={['fab', iconType]} />
	)
}
