// Module imports
import { MDXRemote } from 'next-mdx-remote/rsc'

// Local imports
import Codepen from './Codepen.js'
import { DITAA } from '../helpers/markdownRenderers/DITAA.js'
import { Link } from '../helpers/markdownRenderers/Link.js'
import { Notice } from '../helpers/markdownRenderers/Notice.js'
import { OrderedList } from '../helpers/markdownRenderers/OrderedList.js'
import Tweet from './Tweet.js'
import { UnorderedList } from '../helpers/markdownRenderers/UnorderedList.js'
import { Directive } from '../helpers/markdownRenderers/Directive.js'

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
	Directive,
	DITAA,
	Notice,
	Tweet,
}

export function MDXRenderer(props) {
	const { source, options = {} } = props

	return (
		<MDXRemote
			source={source}
			options={options}
			components={COMPONENTS} />
	)
}
