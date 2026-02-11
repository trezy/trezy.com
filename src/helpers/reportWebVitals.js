export function reportWebVitals({ id, name, label, value }) {
	if (typeof window.gtag === 'function') {
		window.gtag('event', name, {
			event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metrics',
			event_label: id,
			value: Math.round(name === 'CLS' ? value * 1000 : value),
			non_interaction: true,
		})
	}
}
