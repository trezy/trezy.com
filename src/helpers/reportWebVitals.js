// Module imports
import 'firebase/analytics'





// Local imports
import { firebase } from 'helpers/firebase'





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

	firebase
		.analytics()
		.logEvent(name, {
			category,
			label,
			nonInteraction: true,
			value: Math.round(action === 'CLS' ? value * 1000 : value),
		})
}
