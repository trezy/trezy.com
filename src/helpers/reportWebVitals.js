// Local imports
// import { Ackee } from 'hooks/useAckee.js'





export function reportWebVitals(data) {
	const {
		name,
		value,
	} = data

	let fullName = name

	switch (name) {
		case 'CLS':
			fullName = 'Cumulative Layout Shift'
			break

		case 'FCP':
			fullName = 'First Contentful Paint'
			break

		case 'FID':
			fullName = 'First Input Delay'
			break

		case 'LCP':
			fullName = 'Largest Contentful Paint'
			break

		case 'TTFB':
			fullName = 'Time to First Byte'
			break

		case 'Next.js-hydration':
			fullName = 'Next.js Hydration'
			break
	}

	// Ackee.trackAction('1a4752fb-2ece-4b81-b8ee-d42829975bd9', {
	// 	key: fullName,
	// 	value: Math.round(name === 'CLS' ? value * 1000 : value),
	// })
}
