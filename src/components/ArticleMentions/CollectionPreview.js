'use client'

// Module imports
import Link from 'next/link'
import PropTypes from 'prop-types'

// Local imports
import { MentionCard } from './MentionCard.js'

export function CollectionPreview({ articleSlug, group }) {
	return (
		<div
			className={'collection-preview'}
			data-collection={group.id}>
			<div className={'collection-preview-header'}>
				<span className={'collection-name'}>{group.name}</span>

				<span className={'collection-total'}>
					{group.total}
					{group.total === 1 ? ' mention' : ' mentions'}
				</span>
			</div>

			<ul className={'collection-preview-list'}>
				{group.items.map((item, i) => (
					<MentionCard
						key={item.uri || i}
						item={item} />
				))}
			</ul>

			{group.total > group.items.length && (
				<Link
					className={'collection-more'}
					href={`/blog/${articleSlug}/mentions/${encodeURIComponent(group.id)}`}>
					{'View all →'}
				</Link>
			)}
		</div>
	)
}

CollectionPreview.propTypes = {
	articleSlug: PropTypes.string.isRequired,
	group: PropTypes.shape({
		collections: PropTypes.arrayOf(PropTypes.string).isRequired,
		id: PropTypes.string.isRequired,
		items: PropTypes.array.isRequired,
		name: PropTypes.string.isRequired,
		total: PropTypes.number.isRequired,
	}).isRequired,
}
