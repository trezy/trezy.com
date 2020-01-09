// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'





const ArticleMeta = props => {
  const { isDraft } = props

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
    </div>
  )
}

ArticleMeta.defaultProps = {
  publishedAt: null,
  updatedAt: null,
}

ArticleMeta.propTypes = {
  createdAt: PropTypes.object.isRequired,
  isDraft: PropTypes.bool.isRequired,
  publishedAt: PropTypes.object,
  updatedAt: PropTypes.object,
}





export default ArticleMeta
