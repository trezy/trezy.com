// Local imports
import { PageContent } from 'components/PageContent.js'

export const metadata = {
	title: 'Error: 404 - Not Found',
}

export default function NotFound() {
	return (
		<PageContent
			showHeader={false}
			title="Error: 404 - Not Found">
			<header className="block">
				<h2><code>404</code> - Probably Gone Forever</h2>
			</header>

			<section className="block">
				<p>I swear that page was around here somewhere. I'll go look for it and... uh... I guess I'll let you know if it turns up? 🤷🏻‍♂️</p>
			</section>
		</PageContent>
	)
}
