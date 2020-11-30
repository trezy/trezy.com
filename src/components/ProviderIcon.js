// Module imports
import React from 'react'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





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
