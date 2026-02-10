// Module imports
import {
	// faBadgeCheck,
	faRetweet,
} from '@fortawesome/free-solid-svg-icons'
import {
	faComment,
	faHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
	Fragment,
	useMemo,
} from 'react'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import PropTypes from 'prop-types'





// Local imports
import { DateTime } from './DateTime.js'
import { ExternalLink } from './ExternalLink.js'
import { Video } from './Video.js'





function Tweet(props) {
	const {
		isQuotedTweet = false,
		tweet,
	} = props

	if (!tweet) {
		return null
	}

	const {
		author,
		body,
		createdAt,
		entities,
		id,
		likes,
		media,
		quoteRetweets,
		referencedTweets,
		replies,
		retweets,
	} = tweet

	const createdAtDate = new Date(createdAt)

	const urls = useMemo(() => {
		return {
			authorUrl: `https://twitter.com/${author.username}`,
			likeUrl: `https://twitter.com/intent/like?tweet_id=${id}`,
			replyUrl: `https://twitter.com/intent/tweet?in_reply_to=${id}`,
			retweetUrl: `https://twitter.com/intent/retweet?tweet_id=${id}`,
			tweetUrl: `https://twitter.com/${author.username}/status/${id}`,
		}
	}, [
		author,
		id,
	])

	const quoteTweet = referencedTweets?.find(tweet => {
		return tweet.referenceType === 'quoted'
	})

	const formattedBody = entities?.reduce((accumulator, entity, index) => {
		if (index === 0) {
			accumulator.unshift((
				<Fragment key={`${index}-suffix`}>
					{body.substring(entity.end)}
				</Fragment>
			))
		} else if (entity.end < entities[index - 1].start) {
			accumulator.unshift((
				<Fragment key={`${index}-suffix`}>
					{body.substring(entity.end, entities[index - 1].start)}
				</Fragment>
			))
		}

		switch (entity.type) {
			case 'hashtag':
				accumulator.unshift((
					<ExternalLink
						key={`${index}-content`}
						href={`https://twitter.com/hashtag/${entity.tag}`}>
						{body.substring(entity.start, entity.end)}
					</ExternalLink>
				))
				break

			case 'mention':
				accumulator.unshift((
					<ExternalLink
						key={`${index}-content`}
						href={`https://twitter.com/${entity.username}`}>
						{body.substring(entity.start, entity.end)}
					</ExternalLink>
				))
				break

			case 'url':
				if (!entity.isImage) {
					accumulator.unshift((
						<ExternalLink
							key={`${index}-content`}
							href={entity.url}>
							{entity.displayURL}
						</ExternalLink>
					))
					break
				}
		}

		if (index === (entities.length - 1)) {
			accumulator.unshift((
				<Fragment key={`${index}-prefix`}>
					{body.substring(0, entity.start)}
				</Fragment>
			))
		}

		return accumulator
	}, []) || body

	return (
		<article className={'tweet'}>
			<header>
				<ExternalLink
					className={'avatar'}
					href={urls.author}>
					<Image
						alt={author.username}
						height={48}
						src={author.profile_image_url}
						width={48} />
				</ExternalLink>

				<div className={'names'}>
					<ExternalLink
						className={'no-style'}
						href={urls.author}>
						<span className={'display-name'}>
							{author.name}

							{/* <FontAwesomeIcon
								fixedWidth
								icon={faBadgeCheck}
								title={'Verified'} /> */}
						</span>
					</ExternalLink>

					<ExternalLink
						className={'highlight-on-interact no-style'}
						href={urls.author}>
						<span className={'username'}>
							{`@${author.username}`}
						</span>
					</ExternalLink>

					{isQuotedTweet && (
						<ExternalLink
							className={'created-at highlight-on-interact no-style'}
							href={urls.tweet}>
							<DateTime
								prefix={'Time Posted:'}
								value={createdAtDate} />
						</ExternalLink>
					)}
				</div>

				<FontAwesomeIcon
					className={'twitter-logo'}
					icon={faTwitter}
					size={'2x'} />
			</header>

			<div className={'body'}>
				{formattedBody}
			</div>

			{Boolean(media.length) && (
				<ul
					className={'media'}
					data-item-count={media.length}>
					{media.map((mediaItem, index) => {
						if (mediaItem?.type && !['photo', 'video'].includes(mediaItem.type)) {
							return null
						}

						switch (mediaItem.type) {
							case 'photo':
								const imageProps = {
									alt: mediaItem.altText,
									key: index,
									fill: true,
									style: { objectFit: 'cover' },
									src: mediaItem.url,
								}

								if (media.length === 1) {
									imageProps.height = mediaItem.height
									imageProps.fill = undefined
									imageProps.style = undefined
									imageProps.width = mediaItem.width
								}

								return (
									<li>
										<ExternalLink href={mediaItem.url}>
											<Image {...imageProps} />
										</ExternalLink>
									</li>
								)

							case 'video':
								return (
									<Video
										isAutoplay
										isLooping
										isMuted
										height={mediaItem.height}
										poster={mediaItem.previewURL}
										preload={'auto'}
										sources={mediaItem.variants}
										width={mediaItem.width} />
								)
						}
					})}
				</ul>
			)}

			{Boolean(quoteTweet) && (
				<Tweet
					isQuotedTweet
					tweet={quoteTweet} />
			)}

			{isQuotedTweet && (
				<ExternalLink href={urls.tweet}>
					{'Show this thread'}
				</ExternalLink>
			)}

			{!isQuotedTweet && (
				<ExternalLink
					className={'created-at highlight-on-interact no-style'}
					href={urls.tweet}>
					<DateTime
						prefix={'Time Posted:'}
						value={createdAtDate} />
				</ExternalLink>
			)}

			{!isQuotedTweet && (
				<footer>
					<ul className={'reactions'}>
						<li>
							<ExternalLink
								className={'no-style reaction'}
								href={urls.reply}>
								<FontAwesomeIcon
									fixedWidth
									icon={faComment}
									title={'Reply'}
									transform={'grow-2'} />

								{(replies > 0) && (
									<span className={'count'}>
										{replies}
									</span>
								)}
							</ExternalLink>
						</li>

						<li>
							<ExternalLink
								className={'no-style reaction'}
								href={urls.retweet}>
								<FontAwesomeIcon
									fixedWidth
									icon={faRetweet}
									title={'Retweet'}
									transform={'grow-2'} />

								{((retweets + quoteRetweets) > 0) && (
									<span className={'count'}>
										{retweets + quoteRetweets}
									</span>
								)}
							</ExternalLink>
						</li>

						<li>
							<ExternalLink
								className={'no-style reaction'}
								href={urls.like}>
								<FontAwesomeIcon
									fixedWidth
									icon={faHeart}
									title={'Like'}
									transform={'grow-2'} />

								{(likes > 0) && (
									<span className={'count'}>
										{likes}
									</span>
								)}
							</ExternalLink>
						</li>
					</ul>
				</footer>
			)}
		</article>
	)
}

Tweet.propTypes = {
	isQuotedTweet: PropTypes.bool,
	tweet: PropTypes.shape({}).isRequired,
}





export default Tweet
