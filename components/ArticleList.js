// Module imports
import {
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Article from './Article'





const ArticleList = props => {
  const {
    className,
    editMode,
    includeDraft,
    includePublished,
    limit,
  } = props

  const queryObject = { collection: 'articles' }

  if (!includeDraft) {
    queryObject.where = ['isDraft', '==', false]
  }

  if (!includePublished) {
    queryObject.where = ['isDraft', '==', true]
  }

  if (includePublished && includeDraft) {
    queryObject.orderBy = ['createdAt', 'desc']
  } else if (includePublished) {
    queryObject.orderBy = ['publishedAt', 'desc']
  } else { // includeDraft
    queryObject.orderBy = ['updatedAt', 'desc']
  }

  if (limit) {
    queryObject.limit = limit
  }

  const articles = useSelector(state => state.firestore.ordered.articles)

  useFirestoreConnect([queryObject])

  if (!isLoaded(articles)) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <ol className={classnames('article-list', className)}>
      {articles.map(({ id }) => (
        <li key={id}>
          <Article
            editMode={editMode}
            id={id}
            shouldLoad={false}
            summarize />
        </li>
      ))}
    </ol>
  )
}

ArticleList.defaultProps = {
  className: '',
  editMode: false,
  includeDraft: false,
  includePublished: true,
  limit: null,
}

ArticleList.propTypes = {
  className: PropTypes.string,
  editMode: PropTypes.bool,
  includeDraft: PropTypes.bool,
  includePublished: PropTypes.bool,
  limit: PropTypes.number,
}





export default ArticleList
