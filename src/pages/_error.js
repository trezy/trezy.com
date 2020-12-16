// Local imports
import PageWrapper from 'components/PageWrapper'





function ErrorPage(props) {
	const { statusCode } = props

	const {
		body,
		title,
	} = pageData[statusCode] || {}

	return (
		<PageWrapper
			description="An error has occured."
			title={`Error: ${statusCode} - ${title || 'Unrecognized Error'}`}>

			{Boolean(!pageData[statusCode]) && (
				<section className="block">
					<h2><code>{statusCode}</code> Unrecognized Error</h2>

					<p>I honestly have no idea what happened. Guess I should probably send this error to myself so I can debug it, huh? 🤔</p>
				</section>
			)}

			{Boolean(pageData[statusCode]) && (
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
