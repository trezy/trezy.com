// Local imports
import PageWrapper from 'components/PageWrapper'





export default function FourOhFourPage(props) {
	return (
		<PageWrapper
			title="Error: 404 - Not Found"
			showHeader={false}>
			<header className="block">
				<h2><code>404</code> - Probably Gone Forever</h2>
			</header>

			<section className="block">
				<p>I swear that page was around here somewhere. I'll go look for it and... uh... I guess I'll let you know if it turns up? 🤷🏻‍♂️</p>
			</section>
		</PageWrapper>
	)
}
