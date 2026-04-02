'use client'

// Local imports
import { PageContent } from 'components/PageContent.js'

export default function Error({ error, reset }) {
	return (
		<PageContent
			title="Error: 500 - Aw, butts.">
			<section className="block">
				<h2><code>500</code> Aw, butts.</h2>

				<p>Okay, so... this is embarassing. I'm not sure what happened, but I <em>do</em> know that it's not good.</p>
				<p>Whatever just happened has been reported to the proper authorities or whatever.</p>
			</section>
		</PageContent>
	)
}
