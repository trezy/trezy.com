// Module imports
import ReactMarkdown from 'react-markdown/with-html'





// Local imports
import { config } from 'helpers/reactMarkdownConfig'





export default function MarkdownRenderer(props) {
	return (
		<div>
			<ReactMarkdown
				{...config}
				{...props} />
		</div>
	)
}
