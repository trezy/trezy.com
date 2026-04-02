// Module imports
import { Suspense } from 'react'

// Local imports
import { ThankYouContent } from './ThankYouContent.js'

export const metadata = {
	title: 'Thank You',
}

export default function ThankYouPage() {
	return (
		<Suspense>
			<ThankYouContent />
		</Suspense>
	)
}
