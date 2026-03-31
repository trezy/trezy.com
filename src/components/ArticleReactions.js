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
	useRef,
	useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import * as API from '../helpers/API.js'
import { ATProtoLoginModal } from './ATProtoLoginModal/index.js'
import { createReaction, deleteReaction } from '../helpers/atprotoReactions.js'
import { ExternalLink } from './ExternalLink.js'
import { getArticleURL } from 'helpers/getArticleURL.js'
import { ReactionButton } from 'components/ReactionButton/index.js'
import { useATProto } from 'contexts/ATProtoContext.js'





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

	const {
		agent,
		did,
		isAuthenticated,
		isLoading: isATProtoLoading,
	} = useATProto()

	const [reactions, setReactions] = useState({})
	const [userRkeys, setUserRkeys] = useState({})
	const userRkeysRef = useRef(userRkeys)
	userRkeysRef.current = userRkeys
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [pendingReactionType, setPendingReactionType] = useState(null)

	const handleReactionClick = useCallback(type => () => {
		if (!isAuthenticated) {
			setPendingReactionType(type)
			setShowLoginModal(true)
			return
		}

		if (!article.atUri || !article.atCid) return

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

				const rkey = userRkeysRef.current[type]
				if (rkey) {
					deleteReaction(agent, rkey)
						.then(() => API.removeAtprotoReaction(article.id, did, type))
						.catch(err => {
							console.error('[Reactions] Failed to remove reaction:', err)
							setReactions(prev => ({
								...prev,
								[type]: {
									count: (prev[type]?.count ?? 0) + 1,
									isActive: true,
								},
							}))
						})
					setUserRkeys(prev => {
						const next = { ...prev }
						delete next[type]
						return next
					})
				}
			} else {
				newState[type] = {
					count: newState[type].count + 1,
					isActive: true,
				}

				createReaction(agent, article.atUri, article.atCid, type)
					.then(({ rkey }) => {
						setUserRkeys(prev => ({ ...prev, [type]: rkey }))
						return API.addAtprotoReaction(article.id, did, type, rkey)
					})
					.catch(err => {
						console.error('[Reactions] Failed to create reaction:', err)
						setReactions(prev => ({
							...prev,
							[type]: {
								count: (prev[type]?.count ?? 1) - 1,
								isActive: false,
							},
						}))
					})
			}

			return newState
		})
	}, [
		agent,
		article.atCid,
		article.atUri,
		article.id,
		did,
		isAuthenticated,
	])

	const handleLoginModalClose = useCallback(() => {
		setShowLoginModal(false)
		setPendingReactionType(null)
	}, [])

	const handleLoginStart = useCallback(() => {
		if (pendingReactionType) {
			sessionStorage.setItem('pendingAtprotoReaction', JSON.stringify({
				articleSlug: article.slug,
				reactionType: pendingReactionType,
			}))
		}
	}, [article.slug, pendingReactionType])

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
		handleReactionClick,
		reactions,
	])

	const blueskySearchURL = useMemo(() => {
		const url = new URL('/search', 'https://bsky.app')

		url.searchParams.append('q', encodedArticleURL)

		return url.toString()
	}, [encodedArticleURL])

	const blueskyShareURL = useMemo(() => {
		const url = new URL('/intent/compose', 'https://bsky.app')

		url.searchParams.append('text', `Check out "${article.title}" ${encodedArticleURL}`)

		return url.toString()
	}, [
		article.title,
		encodedArticleURL,
	])

	// Load reaction counts and user's reactions
	useEffect(() => {
		if (isATProtoLoading) return

		async function loadReactions() {
			const promises = [API.getReactionsForArticle(article.id)]

			if (isAuthenticated && did) {
				promises.push(API.getAtprotoReactionsForUser(article.id, did))
			}

			const [allReactions, userReactions] = await Promise.all(promises)

			setReactions(() => {
				const newState = {}

				allReactions.forEach(reactionData => {
					newState[reactionData.type] = {
						count: reactionData.count,
						isActive: false,
					}
				})

				if (userReactions) {
					userReactions.forEach(({ type, atproto_rkey }) => {
						if (!newState[type]) {
							newState[type] = { count: 0, isActive: false }
						}
						newState[type].isActive = true
						setUserRkeys(prev => ({ ...prev, [type]: atproto_rkey }))
					})
				}

				return newState
			})
		}

		loadReactions()
	}, [
		article.id,
		did,
		isATProtoLoading,
		isAuthenticated,
	])

	// Handle pending reaction after OAuth redirect
	useEffect(() => {
		if (!isAuthenticated || !agent || !article.atUri || !article.atCid) return

		const pending = sessionStorage.getItem('pendingAtprotoReaction')
		if (!pending) return

		try {
			const { articleSlug, reactionType } = JSON.parse(pending)

			if (articleSlug === article.slug) {
				sessionStorage.removeItem('pendingAtprotoReaction')
				handleReactionClick(reactionType)()
			}
		} catch {
			sessionStorage.removeItem('pendingAtprotoReaction')
		}
	}, [
		agent,
		article.atCid,
		article.atUri,
		article.slug,
		handleReactionClick,
		isAuthenticated,
	])

	return (
		<aside className="article-responses-wrapper">
			<h3>{'Before you leave...'}</h3>

			<p>{'I hope you enjoyed the article! If so, consider leaving a reaction or ten! I\'d love if you would share it on Bluesky if you think others might enjoy this article! 🥰'}</p>

			<div className="article-responses">
				<ul className="share-links">
					<li><Link href={blueskyShareURL}>{'Share on Bluesky'}</Link></li>
					<li><Link href={blueskySearchURL}>{'Discuss on Bluesky'}</Link></li>
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

			{showLoginModal && (
				<ATProtoLoginModal
					onClose={handleLoginModalClose}
					onLoginStart={handleLoginStart} />
			)}
		</aside>
	)
}

ArticleReactions.propTypes = {
	article: PropTypes.object.isRequired,
}
