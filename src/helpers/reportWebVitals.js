// Local imports
import * as gtag from 'helpers/gtag'





export function reportWebVitals(data) {
	const {
		id: label,
		name: action,
		label: vitalLabel,
		value,
	} = data
	let category = 'Next.js custom metric'

	if (vitalLabel === 'web-vital') {
		category = 'Web Vitals'
	}

	gtag.event({
		action,
		category,
		label,
		nonInteraction: true,
		value: Math.round(action === 'CLS' ? value * 1000 : value),
	})
}
