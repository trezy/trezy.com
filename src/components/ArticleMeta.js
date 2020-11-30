// Module imports
import Link from 'next/link'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { firebase } from 'helpers/firebase'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAuth } from 'contexts/AuthContext'





const ArticleMeta = props => {
	const {
		authorID,
		id,
		isDraft,
	} = props
	const { Timestamp } = firebase.firestore
	const { user } = useAuth()
	const isEditable = user?.uid === authorID

	// Convert timestamps back to Firebase Timestamp objects
	const timestamps = {}

	const timestampKeys = ['createdAt', 'publishedAt', 'updatedAt']
	timestampKeys.forEach(key => {
		let timestamp = props[key]

		if (timestamp instanceof Timestamp) {
			timestamp = timestamp.toMillis()
		}

		timestamps[key] = moment(timestamp)
	})

	// Convert timestamps to Moments
	const primaryDate = isDraft ? 'publishedAt' : 'createdAt'

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

ArticleMeta.defaultProps = {
	authorID: null,
	publishedAt: null,
	updatedAt: null,
}

ArticleMeta.propTypes = {
	authorID: PropTypes.string,
	createdAt: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
	]).isRequired,
	id: PropTypes.string.isRequired,
	isDraft: PropTypes.bool.isRequired,
	publishedAt: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
	]),
	updatedAt: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
	]),
}





export default ArticleMeta
