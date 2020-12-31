// Module imports
import { memo } from 'react'
import { useColorMode } from 'react-color-mode'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import TweetEmbed from 'react-tweet-embed'





const Tweet = memo(props => {
	const {
		id,
		includeConversation,
	} = props
	const { colorMode } = useColorMode()
	const { locale } = useRouter()
	const tweetOptions = {
		align: 'center',
		dnt: true,
		lang: locale,
	}

	if (!includeConversation) {
		tweetOptions.conversation = 'none'
	}

	if (colorMode === 'dark') {
		tweetOptions.theme = colorMode
	}

	return (
		<TweetEmbed
			id={id}
			options={tweetOptions} />
	)
})

Tweet.defaultProps = {
	includeConversation: false,
}

Tweet.propTypes = {
	id: PropTypes.string.isRequired,
	includeConversation: PropTypes.bool,
}





export default Tweet
