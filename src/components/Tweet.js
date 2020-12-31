// Module imports
import { memo } from 'react'
import { useColorMode } from 'react-color-mode'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import TweetEmbed from 'react-tweet-embed'





const Tweet = memo(props => {
	const {
		id,
		showCards,
		showConversation,
	} = props
	const { colorMode } = useColorMode()
	const { locale } = useRouter()
	const tweetOptions = {
		align: 'center',
		dnt: true,
		lang: locale,
	}

	if (!showConversation) {
		tweetOptions.conversation = 'none'
	}

	if (!showCards) {
		tweetOptions.cards = 'hidden'
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
	showCards: false,
	showConversation: false,
}

Tweet.propTypes = {
	id: PropTypes.string.isRequired,
	showCards: PropTypes.bool,
	showConversation: PropTypes.bool,
}





export default Tweet
