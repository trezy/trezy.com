// Module imports
import {
  // isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
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
    publishedAt,
  } = props

  const author = useAuthorSelector(props)

  useFirestoreConnect([
    {
      collection: 'users',
      doc: authorID,
    },
  ])

  return (
    <article
      className="response"
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
  )
}

Response.propTypes = {
  authorID: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  publishedAt: PropTypes.object.isRequired,
}





export default Response
