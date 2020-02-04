// Module imports
import {
  // isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import classnames from 'classnames'
import marked from 'marked'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import useAuthorSelector from '../store/selectors/useAuthorSelector'





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

  const author = useAuthorSelector(props)
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
        <div className="alert warning">
          This comment will be made public once it has passed our automated spam detection.
        </div>
      )}

      {isPendingHumanVerification && (
        <div className="alert warning">
          Our automated spam detection has marked this comment as spam. It is now awaiting review by a human.
        </div>
      )}

      {isSpam && (
        <div className="alert warning">
          This comment has been marked as spam and will not be made public.
        </div>
      )}

      <article
        className={classnames({
          pending: isPending,
          response: true,
          spam: isSpam,
        })}
        id={id}>

        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: marked(body) }} />

        <footer>
          <ul className="pipe-separated">
            {isLoaded(author) && (
              <li>
                <img
                  alt={`${author.displayName}'s avatar`}
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
