// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const config = options => {
	const {
		option,
		value,
	} = options

	window.gtag('config', option, value)
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = options => {
	const {
		action,
		category,
		label,
		nonInteraction = false,
		value,
	} = options

	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		non_interaction: nonInteraction,
		value,
	})
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
	window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID, {
		page_path: url,
	})
}
