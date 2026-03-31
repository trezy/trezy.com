// Module imports
import { MDXRemote } from 'next-mdx-remote'





// Local imports
import Codepen from './Codepen.js'
import { DITAA } from '../helpers/markdownRenderers/DITAA.js'
import { Link } from '../helpers/markdownRenderers/Link.js'
import { Notice } from '../helpers/markdownRenderers/Notice.js'
import { OrderedList } from '../helpers/markdownRenderers/OrderedList.js'
import Tweet from './Tweet.js'
import { UnorderedList } from '../helpers/markdownRenderers/UnorderedList.js'





const COMPONENTS = {
	a: Link,

	ol: OrderedList,

	pre: function Pre({ children, ...props }) {
		return (
			<pre {...props}>
				{children}
			</pre>
		)
	},

	ul: UnorderedList,

	// Custom components
	Codepen,
	DITAA,
	Notice,
	Tweet,
}

export function MDXRenderer(props) {
	const { source } = props

	return (
		<MDXRemote
			{...source}
			components={COMPONENTS} />
	)
}
