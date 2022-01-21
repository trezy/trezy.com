// Module imports
import { useMemo } from 'react'
import Link from 'next/link'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAuth } from 'contexts/AuthContext'





export function ArticleMeta(props) {
	const { article } = props
	const { readtime } = article

	const [
		publishedAt,
		updatedAt,
	] = useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
		})

		return [
			formatter.format(new Date(article.createdAt)),
			formatter.format(new Date(article.updatedAt)),
		]
	}, [
		article.createdAt,
		article.updatedAt,
	])

	return (
		<div className="meta">
			<span>
				<FontAwesomeIcon
					fixedWidth
					icon="clock" />
				{' '}
				Published {publishedAt}
			</span>

			{(publishedAt !== updatedAt) && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Updated {updatedAt}
				</span>
			)}

			<span>
				<FontAwesomeIcon
					fixedWidth
					icon="clock" />
				{' '}
				{/* Less than a minute */}
				{(readtime < (60 * 1000)) && (
					'Less than 1 min read'
				)}

				{/* More than a minute, less than 90 */}
				{(readtime > (60 * 1000)) && (
					`${Math.round(readtime / 1000 / 60)} min read`
				)}
			</span>
		</div>
	)
}
