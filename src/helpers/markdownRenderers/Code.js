// Module imports
import React, {
	useEffect,
	useRef,
} from 'react'
import Prism from 'prismjs/components/prism-core'
/* eslint-disable import/no-unassigned-import */
import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
/* eslint-enable import/no-unassigned-import */
import PropTypes from 'prop-types'





if (typeof window !== 'undefined') {
	// eslint-disable-next-line camelcase
	Prism.plugins.autoloader.languages_path = '/prism-grammars/'
}





const Code = props => {
	const elementRef = useRef(null)
	const {
		language,
		value,
	} = props

	useEffect(() => {
		Prism.highlightElement(elementRef.current)
	}, [
		elementRef,
		value,
	])

	return (
		<pre className="line-numbers">
			<code
				className={`language-${language}`}
				ref={elementRef}>
				{value}
			</code>
		</pre>
	)
}

Code.propTypes = {
	language: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
}





export { Code }
