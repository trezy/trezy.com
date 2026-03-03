// Module imports
import {
	useEffect,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





function Code(props) {
	const elementRef = useRef(null)
	const [prismLoaded, setPrismLoaded] = useState(false)
	const {
		language,
		value,
	} = props

	useEffect(() => {
		const Prism = require('prismjs/components/prism-core')
		require('prismjs/plugins/autoloader/prism-autoloader')
		require('prismjs/plugins/line-numbers/prism-line-numbers')
		require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace')
		require('prismjs/plugins/toolbar/prism-toolbar')
		require('prismjs/plugins/show-language/prism-show-language')

		// eslint-disable-next-line camelcase
		Prism.plugins.autoloader.languages_path = '/prism-grammars/'
		setPrismLoaded(true)
	}, [])

	useEffect(() => {
		if (prismLoaded && elementRef.current) {
			const Prism = require('prismjs/components/prism-core')
			Prism.highlightElement(elementRef.current)
		}
	}, [
		prismLoaded,
		language,
		value,
	])

	return (
		<pre className="line-numbers">
			<code
				className={classnames({
					[`language-${language}`]: Boolean(language),
				})}
				ref={elementRef}>
				{value}
			</code>
		</pre>
	)
}

Code.propTypes = {
	language: '',
}

Code.propTypes = {
	language: PropTypes.string,
	value: PropTypes.string.isRequired,
}





export { Code }
