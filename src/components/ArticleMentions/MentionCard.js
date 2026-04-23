'use client'

// Module imports
import PropTypes from 'prop-types'

// Local imports
import { DateTime } from 'components/DateTime.js'
import { ExternalLink } from 'components/ExternalLink.js'
import { getHighlightId } from './api.js'

function AuthorInfo({ author, timestamp }) {
	return (
		<span className={'mention-meta'}>
			{author?.avatar && (
				<img
					alt={''}
					className={'mention-avatar'}
					src={author.avatar} />
			)}

			{author && (
				<strong className={'mention-display-name'}>
					{author.displayName || author.handle}
				</strong>
			)}

			{author && (
				<span className={'mention-handle'}>
					{'@'}{author.handle}
				</span>
			)}

			{timestamp && (
				<DateTime
					showTime={false}
					value={timestamp} />
			)}
		</span>
	)
}

AuthorInfo.propTypes = {
	author: PropTypes.object,
	timestamp: PropTypes.string,
}

function BskyPostMention({ item }) {
	const rkey = item.uri.split('/').pop()
	const postURL = `https://bsky.app/profile/${item.author.handle}/post/${rkey}`

	return (
		<li className={'mention-card'}>
			<ExternalLink
				className={'mention-card-link'}
				href={postURL}>
				<AuthorInfo
					author={item.author}
					timestamp={item.createdAt} />

				<p className={'mention-text'}>{item.text}</p>
			</ExternalLink>
		</li>
	)
}

function StandardDocMention({ item }) {
	const url = (item.siteURL && item.path)
		? `${item.siteURL.replace(/\/$/, '')}${item.path}`
		: null

	const inner = (
		<>
			<AuthorInfo
				author={item.author}
				timestamp={item.publishedAt} />

			<p className={'mention-text'}>
				<strong>{item.title}</strong>
				{item.siteName && (
					<>
						{' on '}
						<em>{item.siteName}</em>
					</>
				)}
			</p>
		</>
	)

	return (
		<li className={'mention-card'}>
			{url ? (
				<ExternalLink
					className={'mention-card-link'}
					href={url}>
					{inner}
				</ExternalLink>
			) : (
				<div className={'mention-card-link'}>
					{inner}
				</div>
			)}
		</li>
	)
}

function SembleCardMention({ item }) {
	return (
		<li className={'mention-card'}>
			<div className={'mention-card-link'}>
				<AuthorInfo
					author={item.author}
					timestamp={item.createdAt} />

				{item.type === 'note' && item.text ? (
					<p className={'mention-text'}>{item.text}</p>
				) : (
					<p className={'mention-text'}>{'Bookmarked this article'}</p>
				)}
			</div>
		</li>
	)
}

function SembleConnectionMention({ item }) {
	return (
		<li className={'mention-card'}>
			<div className={'mention-card-link'}>
				<AuthorInfo
					author={item.author}
					timestamp={item.createdAt} />

				<p className={'mention-text'}>
					{item.note || (
						<>
							{'Connected to '}
							{item.target?.startsWith('http') ? (
								<em>{item.target}</em>
							) : (
								'another resource'
							)}
						</>
					)}
				</p>
			</div>
		</li>
	)
}

function scrollToHighlight(event, highlightId) {
	const el = document.getElementById(highlightId)
	if (!el) return

	event.preventDefault()
	el.scrollIntoView({ behavior: 'smooth', block: 'center' })
	el.classList.add('margin-inline-highlight--flash')
	el.addEventListener('animationend', () => {
		el.classList.remove('margin-inline-highlight--flash')
	}, { once: true })
}

function MarginHighlightMention({ item }) {
	const highlightStyle = item.color
		? {
			borderLeftColor: item.color,
			background: `linear-gradient(90deg, ${item.color}14 0%, transparent 100%)`,
		}
		: undefined

	const highlightId = getHighlightId(item.highlightText)

	return (
		<li className={'mention-card'}>
			<a
				className={'mention-card-link'}
				href={highlightId ? `#${highlightId}` : undefined}
				onClick={highlightId ? (e) => scrollToHighlight(e, highlightId) : undefined}>
				<AuthorInfo
					author={item.author}
					timestamp={item.createdAt} />

				{item.highlightText ? (
					<blockquote
						className={'mention-highlight'}
						style={highlightStyle}>
						{item.highlightText}
					</blockquote>
				) : (
					<p className={'mention-text'}>{'Highlighted on this page'}</p>
				)}

				{item.annotation && (
					<p className={'mention-annotation'}>{item.annotation}</p>
				)}
			</a>
		</li>
	)
}

export function MentionCard({ item }) {
	switch (item.collection) {
		case 'app.bsky.feed.post':
			return <BskyPostMention item={item} />
		case 'site.standard.document':
			return <StandardDocMention item={item} />
		case 'network.cosmik.card':
			return <SembleCardMention item={item} />
		case 'network.cosmik.connection':
			return <SembleConnectionMention item={item} />
		case 'at.margin.highlight':
		case 'at.margin.note':
			return <MarginHighlightMention item={item} />
		default:
			return null
	}
}

MentionCard.propTypes = {
	item: PropTypes.object,
}
