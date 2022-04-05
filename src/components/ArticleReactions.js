// Module imports
import { useMemo } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button.js'
import { getArticleURL } from 'helpers/getArticleURL.js'
import { ReactionButton } from 'components/ReactionButton/index.js'





const ALLOWED_REACTIONS = [
	{
		emoji: '❤️',
		emojiName: 'heart',
	},
	{
		emoji: '👍',
		emojiName: 'thumbs-up',
	},
	{
		emoji: '🦄',
		emojiName: 'unicorn',
	},
	{
		emoji: '👏',
		emojiName: 'clap',
	},
	{
		emoji: '☕️',
		emojiName: 'coffee',
	},
	{
		emoji: '🏆',
		emojiName: 'trophy',
	},
	{
		emoji: '😍',
		emojiName: 'heart-eyes',
	},
	{
		emoji: '💰',
		emojiName: 'money-bag',
	},
	{
		emoji: '🎉',
		emojiName: 'party-popper',
	},
	{
		emoji: '🚀',
		emojiName: 'rocket',
	},
]

export function ArticleReactions(props) {
	const { article } = props

	const encodedArticleURL = encodeURIComponent(getArticleURL(article))

	const mappedReactions = useMemo(() => {
		return ALLOWED_REACTIONS.map(({ emoji, emojiName }) => (
			<ReactionButton
				key={emoji}
				emoji={emoji}
				emojiName={emojiName}
				id={article.slug}
				namespace="article" />
		))
	}, [ALLOWED_REACTIONS])

	return (
		<aside className="article-responses-wrapper">
			<h3>{'Before you leave...'}</h3>

			<p>{'I hope you enjoyed the article! If so, consider leaving a reaction or ten! I\'d love if you would share it on Twitter if you think others might enjoy this article! 🥰'}</p>

			<div className="article-responses">
				<ul className="share-links">
					<li><Link href={`https://twitter.com/intent/tweet?text=Check out "${article.title}"&url=${encodedArticleURL}}&via=TrezyCodes`}>{'Share on Twitter'}</Link></li>
					<li><Link href={`https://twitter.com/search?q=${encodedArticleURL}`}>{'Discuss on Twitter'}</Link></li>
				</ul>

				<div className="reactions">
					{mappedReactions}
				</div>
			</div>
		</aside>
	)
}

ArticleReactions.defaultProps = {}

ArticleReactions.propTypes = {
	article: PropTypes.object.isRequired,
}
