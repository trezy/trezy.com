// Module imports
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'





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
					icon={faClock} />
					{' '}
				Published {publishedAt}
			</span>

			{(publishedAt !== updatedAt) && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon={faClock} />
					{' '}
					Updated {updatedAt}
				</span>
			)}

			<span>
				<FontAwesomeIcon
					fixedWidth
					icon={faClock} />
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
