// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'





const ArticleMeta = ({ createdAt, publishedAt, updatedAt }) => {
  const primaryDate = publishedAt || createdAt

  return (
    <div className="meta">
      {publishedAt && (
        <span>
          <FontAwesomeIcon
            fixedWidth
            icon="clock" />
          {' '}
          Published {moment(publishedAt).format('D MMMM, Y')}
        </span>
      )}

      {!publishedAt && (
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
}

ArticleMeta.propTypes = {
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  publishedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}





export default ArticleMeta
