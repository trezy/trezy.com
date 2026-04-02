'use client'

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
import { ATProtoLoginModal } from './ATProtoLoginModal/index.js'
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
	const { article, initialReactions = {} } = props

	const {
		agent,
		did,
		isAuthenticated,
		isLoading: isATProtoLoading,
	} = useATProto()

	const MAX_REACTIONS = 20

	const [reactions, setReactions] = useState(initialReactions)
	const [userCounts, setUserCounts] = useState({})
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [pendingReactionType, setPendingReactionType] = useState(null)

	const addReaction = useCallback(type => {
		if (!isAuthenticated) {
			setPendingReactionType(type)
			setShowLoginModal(true)
			return
		}

		if (!article.atUri || !article.atCid) return

		const currentUserCount = userCounts[type] || 0
		if (currentUserCount >= MAX_REACTIONS) return

		setReactions(prev => ({
			...prev,
			[type]: {
				count: (prev[type]?.count ?? 0) + 1,
				userCount: currentUserCount + 1,
			},
		}))
		setUserCounts(prev => ({ ...prev, [type]: currentUserCount + 1 }))

		API.addAtprotoReaction(article.id, did, type)
			.catch(err => {
				console.error('[Reactions] Failed to add reaction:', err)
				setReactions(prev => ({
					...prev,
					[type]: {
						count: (prev[type]?.count ?? 1) - 1,
						userCount: currentUserCount,
					},
				}))
				setUserCounts(prev => ({ ...prev, [type]: currentUserCount }))
			})
	}, [
		article.atCid,
		article.atUri,
		article.id,
		did,
		isAuthenticated,
		userCounts,
	])

	const removeReaction = useCallback(type => {
		const currentUserCount = userCounts[type] || 0
		if (currentUserCount <= 0) return

		setReactions(prev => ({
			...prev,
			[type]: {
				count: Math.max((prev[type]?.count ?? 1) - 1, 0),
				userCount: currentUserCount - 1,
			},
		}))
		setUserCounts(prev => ({ ...prev, [type]: currentUserCount - 1 }))

		API.removeAtprotoReaction(article.id, did, type)
			.catch(err => {
				console.error('[Reactions] Failed to remove reaction:', err)
				setReactions(prev => ({
					...prev,
					[type]: {
						count: (prev[type]?.count ?? 0) + 1,
						userCount: currentUserCount,
					},
				}))
				setUserCounts(prev => ({ ...prev, [type]: currentUserCount }))
			})
	}, [
		article.id,
		did,
		userCounts,
	])

	const handleReactionClick = useCallback(type => () => addReaction(type), [addReaction])

	const handleReactionContextMenu = useCallback(type => (event) => {
		event.preventDefault()
		removeReaction(type)
	}, [removeReaction])

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
					handleContextMenu={handleReactionContextMenu(emojiName)}
					isActive={(userCounts[emojiName] || 0) > 0}
					isMaxed={(userCounts[emojiName] || 0) >= MAX_REACTIONS}
					reactionCount={reactionData?.count ?? 0}
					emoji={emoji} />
			)
		})
	}, [
		handleReactionClick,
		handleReactionContextMenu,
		reactions,
		userCounts,
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

	// Load user's own reaction counts (needs auth)
	useEffect(() => {
		if (isATProtoLoading || !isAuthenticated || !did) return

		API.getAtprotoReactionsForUser(article.id, did).then(userReactions => {
			if (!userReactions) return

			const counts = {}
			userReactions.forEach(({ type, count }) => {
				counts[type] = count
			})
			setUserCounts(counts)
		})
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
				addReaction(reactionType)
			}
		} catch {
			sessionStorage.removeItem('pendingAtprotoReaction')
		}
	}, [
		agent,
		article.atCid,
		article.atUri,
		article.slug,
		addReaction,
		isAuthenticated,
	])

	return (
		<aside className="article-responses-wrapper">
			<h3>{'Before you leave...'}</h3>

			<p>{'I hope you enjoyed the article! If so, consider leaving a reaction or ten! I\'d love if you would share it on Bluesky if you think others might enjoy this article! 🥰'}</p>

			<p>{'This article has no ads, no sponsors, and no bullshit. If you want to keep it that way, consider supporting me with a '}<ExternalLink href="https://ko-fi.com/trezy">{'monthly donation on Ko-fi'}</ExternalLink>{'. Your money buys me the time and independence to chase real stories, talk to the people who matter, and write without a leash.'}</p>

			<div className="article-responses">
				<ul className="share-links">
					<li><Link href={blueskyShareURL}>{'Share on Bluesky'}</Link></li>
					<li><Link href={blueskySearchURL}>{'Discuss on Bluesky'}</Link></li>
					<li><ExternalLink href="https://ko-fi.com/trezy">{'Support me on Ko-fi'}</ExternalLink></li>
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
