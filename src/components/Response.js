// Module imports
import classnames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { useProfiles } from 'contexts/ProfilesContext'
import Alert from 'components/Alert'
import getAvatar from 'helpers/getAvatar'
import MarkdownRenderer from 'components/MarkdownRenderer'





const Response = props => {
	const {
		authorID,
		body,
		id,
		isPendingAkismetVerification,
		isPendingHumanVerification,
		isSpam,
		publishedAt,
	} = props

	const {
		profilesByID,
		watchProfile,
	} = useProfiles()

	watchProfile({ id: authorID })

	const author = profilesByID[authorID]
	const isPending = isPendingAkismetVerification || isPendingHumanVerification

	return (
		<>
			{isPendingAkismetVerification && (
				<Alert type="informational">
					This comment will be made public once it has passed our automated spam detection.
				</Alert>
			)}

			{isPendingHumanVerification && (
				<Alert type="warning">
					Our automated spam detection has marked this comment as spam. It is now awaiting review by a human.
				</Alert>
			)}

			{isSpam && (
				<Alert type="danger">
					This comment has been marked as spam and will not be made public.
				</Alert>
			)}

			<article
				className={classnames({
					pending: isPending,
					response: true,
					spam: isSpam,
				})}
				id={id}>

				<MarkdownRenderer children={body} />

				<footer>
					<ul className="pipe-separated">
						{Boolean(author) && (
							<li>
								<img
									alt={`${author.displayName}'s avatar`}
									className="avatar"
									src={getAvatar(author)} />
								<span>{author.displayName}</span>
							</li>
						)}

						<li>
							{moment(publishedAt.toMillis()).format('[Posted at] h:mm a [on] D MMMM, Y')}
						</li>
					</ul>
				</footer>
			</article>
		</>
	)
}

Response.propTypes = {
	authorID: PropTypes.string.isRequired,
	body: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	isPendingAkismetVerification: PropTypes.bool.isRequired,
	isPendingHumanVerification: PropTypes.bool.isRequired,
	isSpam: PropTypes.bool.isRequired,
	publishedAt: PropTypes.object.isRequired,
}





export default Response
