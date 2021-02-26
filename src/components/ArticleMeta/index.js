// Module imports
import Link from 'next/link'
import moment from 'moment'
import PropTypes from 'prop-types'





// Local imports
import { firebase } from 'helpers/firebase'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useArticle } from 'contexts/ArticleContext'
import { useAuth } from 'contexts/AuthContext'





export function ArticleMeta(props) {
	const article = useArticle().article || props.article
	const {
		authorID,
		id,
		isDraft,
		readtime,
	} = article
	const { Timestamp } = firebase.firestore
	const { user } = useAuth()
	const isEditable = user?.uid === authorID

	const primaryDate = isDraft ? 'publishedAt' : 'createdAt'

	// Convert timestamps to Moments
	const timestamps = {}
	const timestampKeys = ['createdAt', 'publishedAt', 'updatedAt']

	timestampKeys.forEach(key => {
		let timestamp = article[key]

		if (timestamp instanceof Timestamp) {
			timestamp = timestamp.toMillis()
		}

		timestamps[key] = moment(timestamp)
	})

	return (
		<div className="meta">
			{!isDraft && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Published {timestamps.publishedAt.format('D MMMM, Y')}
				</span>
			)}

			{isDraft && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Draft created {timestamps.createdAt.format('D MMMM, Y')}
				</span>
			)}

			{(primaryDate !== 'updatedAt') && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Updated {timestamps.updatedAt.format('D MMMM, Y')}
				</span>
			)}

			{Boolean(readtime) && (
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
			)}

			{isEditable && (
				<span>
					<Link href={`/dashboard/blog/edit/${id}`}>
						<a>Edit</a>
					</Link>
				</span>
			)}
		</div>
	)
}
