// Module imports
import {
	faHeart,
	faHandsClapping,
	faRocket,
	faSackDollar,
	faTrophy,
	faFireFlameCurved,
} from '@fortawesome/free-solid-svg-icons'
import {
	faDev,
	faHashnode,
} from '@fortawesome/free-brands-svg-icons'
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import * as API from '../helpers/API.js'
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
				icon={faFireFlameCurved} />
		),
		emojiName: 'fire',
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

	const [reactions, setReactions] = useState({})

	const handleReactionClick = useCallback(type => () => {
		setReactions(previousState => {
			const newState = { ...previousState }

			if (!newState[type]) {
				newState[type] = {
					count: 0,
					isActive: false,
				}
			}

			if (newState[type].isActive) {
				newState[type] = {
					count: newState[type].count - 1,
					isActive: false,
				}
				API.removeArticleReaction(article.id, localStorage.getItem('browserID'), type)
			} else {
				newState[type] = {
					count: newState[type].count + 1,
					isActive: true,
				}
				API.addArticleReaction(article.id, localStorage.getItem('browserID'), type)
			}

			return newState
		})
	}, [
		article.id,
		setReactions,
	])

	const encodedArticleURL = useMemo(() => {
		let origin = process.env.NEXT_PUBLIC_URL

		if (typeof location !== 'undefined') {
			origin = location.origin
		}

		return new URL(getArticleURL(article), origin)
	}, [article])

	const mappedReactions = useMemo(() => {
		return ALLOWED_REACTIONS.map(({ emoji, emojiName }) => {
			const reactionData = reactions[emojiName]

			return (
				<ReactionButton
					key={emojiName}
					handleClick={handleReactionClick(emojiName)}
					isActive={reactionData?.isActive ?? false}
					reactionCount={reactionData?.count ?? 0}
					emoji={emoji} />
			)
		})
	}, [
		ALLOWED_REACTIONS,
		reactions,
	])

	const twitterDiscussURL = useMemo(() => {
		const url = new URL('/search', 'https://twitter.com')

		url.searchParams.append('q', encodedArticleURL)

		return url.toString()
	}, [encodedArticleURL])

	const twitterShareURL = useMemo(() => {
		const url = new URL('/intent/tweet', 'https://twitter.com')

		url.searchParams.append('text', `Check out "${article.title}"`)
		url.searchParams.append('url', encodedArticleURL)
		url.searchParams.append('via', 'TrezyCodes')

		return url.toString()
	}, [
		article.title,
		encodedArticleURL,
	])

	useEffect(() => {
		(async function foo() {
			const [
				allReactions,
				userReactions,
			] = await Promise.all([
				API.getReactionsForArticle(article.id),
				API.getReactionsForArticle(article.id, localStorage.getItem('browserID')),
			])

			setReactions(previousState => {
				const newState = { ...previousState }

				allReactions.forEach(reactionData => {
					newState[reactionData.type] = previousState[reactionData.type] || {
						count: 0,
						isActive: false,
					}

					newState[reactionData.type].count += reactionData.count
					newState[reactionData.type].isActive = userReactions.includes(reactionData.type)
				})

				return newState
			})
		})()
	}, [
		article,
		setReactions,
	])

	return (
		<aside className="article-responses-wrapper">
			<h3>{'Before you leave...'}</h3>

			<p>{'I hope you enjoyed the article! If so, consider leaving a reaction or ten! I\'d love if you would share it on Twitter if you think others might enjoy this article! 🥰'}</p>

			<div className="article-responses">
				<ul className="share-links">
					<li><Link href={twitterShareURL}>{'Share on Twitter'}</Link></li>
					<li><Link href={twitterDiscussURL}>{'Discuss on Twitter'}</Link></li>
				</ul>

				<div className="reactions">
					{mappedReactions}

					{((article.devToReactions > 0) || (article.hashnodeReactions > 0)) && (
						<div className="separator" />
					)}

					{(article.devToReactions > 0) && (
						<ExternalLink
							className="reaction"
							href={article.devToURL}>
							<FontAwesomeIcon
								fixedWidth
								icon={faDev} />

							<span className="badge">{article.devToReactions}</span>
						</ExternalLink>
					)}

					{(article.hashnodeReactions > 0) && (
						<ExternalLink
							className="reaction"
							href={article.hashnodeURL}>
							<FontAwesomeIcon
								fixedWidth
								icon={faHashnode} />

							<span className="badge">{article.hashnodeReactions}</span>
						</ExternalLink>
					)}
				</div>
			</div>
		</aside>
	)
}

ArticleReactions.propTypes = {
	article: PropTypes.object.isRequired,
}
