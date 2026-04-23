'use client'

// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

// Local imports
import { Block } from 'components/Block/index.js'
import { Container } from 'components/Container/Container.js'
import { MentionCard } from './MentionCard.js'
import { PageContent } from 'components/PageContent.js'
import {
	COLLECTION_GROUPS,
	fetchAllLinks,
	fetchCollectionBacklinks,
	resolveRecords,
} from './api.js'

const ITEMS_PER_PAGE = 20

function sortByDate(items) {
	return [...items].sort((a, b) => {
		const dateA = a.createdAt || a.publishedAt || ''
		const dateB = b.createdAt || b.publishedAt || ''

		return dateB.localeCompare(dateA)
	})
}

export function MentionsDetail({ slug, groupId }) {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

	const group = useMemo(() => {
		return COLLECTION_GROUPS.find(g => g.id === groupId)
	}, [groupId])

	const articleURL = useMemo(() => {
		let origin = process.env.NEXT_PUBLIC_URL

		if (typeof location !== 'undefined') {
			origin = location.origin
		}

		return new URL(`/blog/${slug}`, origin).toString()
	}, [slug])

	useEffect(() => {
		if (!group) return

		async function load() {
			try {
				const links = await fetchAllLinks(articleURL)

				const allItems = await Promise.all(
					group.collections.map(async (collection) => {
						const backlinks = await fetchCollectionBacklinks(articleURL, links, collection, 200)
						return resolveRecords(collection, backlinks)
					}),
				)

				setItems(sortByDate(allItems.flat()))
			} catch {
				setItems([])
			} finally {
				setIsLoading(false)
			}
		}

		load()
	}, [articleURL, group])

	useEffect(() => {
		if (visibleCount >= items.length) return

		const sentinel = document.getElementById('mentions-sentinel')
		if (!sentinel) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, items.length))
				}
			},
			{ rootMargin: '200px' },
		)

		observer.observe(sentinel)

		return () => observer.disconnect()
	}, [items.length, visibleCount])

	const visibleItems = items.slice(0, visibleCount)

	return (
		<PageContent title={group?.name || groupId}>
			<Block elementType={'article'}>
				<Container>
					<Link href={`/blog/${slug}`}>
						{'Back to article'}
					</Link>

					{isLoading && (
						<p>{'Loading mentions...'}</p>
					)}

					{!isLoading && items.length === 0 && (
						<p>{'No mentions found.'}</p>
					)}

					{!isLoading && items.length > 0 && (
						<>
							<p>{items.length}{' mentions'}</p>

							<ul className={'mention-list'}>
								{visibleItems.map((item, i) => (
									<MentionCard
										key={item.uri || i}
										item={item} />
								))}
							</ul>

							{visibleCount < items.length && (
								<div
									id={'mentions-sentinel'}
									style={{ height: '1px' }} />
								)}
						</>
					)}
				</Container>
			</Block>
		</PageContent>
	)
}

MentionsDetail.propTypes = {
	groupId: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
}
