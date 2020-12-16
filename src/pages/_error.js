// Local imports
import PageWrapper from 'components/PageWrapper'





// Local constants
const PAGE_DATA = {
	405: {
		body: (
			<>
				<p>Uh, whatever you just did? Yeah, that thing just is <em>definitely</em> not supported.</p>
				<p>If you're trying to hack into the site, then, like... stop, I guess? That's just rude.</p>
			</>
		),
		title: 'What do you think you\'re doing‽',
	},
	500: {
		body: (
			<>
				<p>Okay, so... this is embarassing. I'm not sure what happened, but I <em>do</em> know that it's not good.</p>
				<p>Whatever just happened has been reported to the proper authorities or whatever.</p>
			</>
		),
		title: 'Aw, butts.',
	},
}





function ErrorPage(props) {
	const { statusCode } = props

	const {
		body,
		title,
	} = PAGE_DATA[statusCode] || {}

	return (
		<PageWrapper
			description="An error has occured."
			title={`Error: ${statusCode} - ${title || 'Unrecognized Error'}`}>

			{Boolean(!PAGE_DATA[statusCode]) && (
				<section className="block">
					<h2><code>{statusCode}</code> Unrecognized Error</h2>

					<p>I honestly have no idea what happened. Guess I should probably send this error to myself so I can debug it, huh? 🤔</p>
				</section>
			)}

			{Boolean(PAGE_DATA[statusCode]) && (
				<section className="block">
					<h2><code>{statusCode}</code> {title}</h2>

					{body}
				</section>
			)}
		</PageWrapper>
	)
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
