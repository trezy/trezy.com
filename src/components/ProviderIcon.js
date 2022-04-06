// Module imports
import {
	faGoogle,
	faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





export default function ProviderIcon(props) {
	const { providerId } = props

	let icon = null

	switch (providerId) {
		case 'google.com':
			icon = faGoogle
			break

		case 'twitter.com':
			icon = faTwitter
			break
	}

	return (
		<FontAwesomeIcon
			fixedWidth
			icon={icon} />
	)
}
