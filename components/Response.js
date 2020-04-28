// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import classnames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import Alert from './Alert'
import MarkdownRenderer from './MarkdownRenderer'
import useUserSelector from '../store/selectors/useUserSelector'





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

  const author = useUserSelector({ userID: authorID })
  const isPending = isPendingAkismetVerification || isPendingHumanVerification

  useFirestoreConnect([
    {
      collection: 'users',
      doc: authorID,
    },
  ])

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

        <MarkdownRenderer source={body} />

        <footer>
          <ul className="pipe-separated">
            {(isLoaded(author) && !isEmpty(author)) && (
              <li>
                <img
                  alt={`${author.displayName}'s avatar`}
                  className="avatar"
                  src={author.avatarUrl} />
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
