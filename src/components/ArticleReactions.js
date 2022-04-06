// Module imports
import {
	faHeart,
	faHandsClapping,
	faRocket,
	faSackDollar,
	faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import { faDev } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { ExternalLink } from './ExternalLink.js'
import { getArticleURL } from 'helpers/getArticleURL.js'
import { ReactionButton } from 'components/ReactionButton/index.js'





const ALLOWED_REACTIONS = [
	{
		emoji: (
			<FontAwesomeIcon
				fixedWidth
				icon={faHeart} />
		),
		emojiName: 'heart',
	},
	{
		emoji: (
			<FontAwesomeIcon
				fixedWidth
				icon={faHandsClapping} />
		),
		emojiName: 'clap',
	},
	{
		emoji: (
			<FontAwesomeIcon
				fixedWidth
				icon={faRocket} />
		),
		emojiName: 'rocket',
	},
	{
		emoji: (
			<FontAwesomeIcon
				fixedWidth
				icon={faSackDollar} />
		),
		emojiName: 'money-bag',
	},
	{
		emoji: (
			<FontAwesomeIcon
				fixedWidth
				icon={faTrophy} />
		),
		emojiName: 'trophy',
	},
]

export function ArticleReactions(props) {
	const { article } = props

	const encodedArticleURL = encodeURIComponent(getArticleURL(article))

	const mappedReactions = useMemo(() => {
		return ALLOWED_REACTIONS.map(({ emoji, emojiName }) => (
			<ReactionButton
				key={emojiName}
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

					{(article.devToReactions > 0) && (
						<ExternalLink
							className="reaction is-active"
							href={article.devToURL}>
							<FontAwesomeIcon
								fixedWidth
								icon={faDev} />

							<span className="badge">{article.devToReactions}</span>
						</ExternalLink>
					)}
				</div>
			</div>
		</aside>
	)
}

ArticleReactions.defaultProps = {}

ArticleReactions.propTypes = {
	article: PropTypes.object.isRequired,
}
