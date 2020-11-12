// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import useCurrentUserIDSelector from 'store/selectors/useCurrentUserIDSelector'





const ArticleMeta = props => {
	const {
		authorID,
		id,
		isDraft,
	} = props
	const currentUserID = useCurrentUserIDSelector()

	const createdAt = moment(props.createdAt?.seconds * 1000)
	const publishedAt = moment(props.publishedAt?.seconds * 1000)
	const updatedAt = moment(props.updatedAt?.seconds * 1000)

	const primaryDate = isDraft ? publishedAt : createdAt

	return (
		<div className="meta">
			{!isDraft && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Published {moment(publishedAt).format('D MMMM, Y')}
				</span>
			)}

			{isDraft && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Draft created {moment(createdAt).format('D MMMM, Y')}
				</span>
			)}

			{(updatedAt !== primaryDate) && (
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon="clock" />
					{' '}
					Updated {moment(updatedAt).format('D MMMM, Y')}
				</span>
			)}

			{(authorID === currentUserID) && (
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
	createdAt: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	isDraft: PropTypes.bool.isRequired,
	publishedAt: PropTypes.object,
	updatedAt: PropTypes.object,
}





export default ArticleMeta
