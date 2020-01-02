// Module imports
import {
  isLoaded,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





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

  const collectionsToLoad = []
  const collectionQueryParams = ['orderByChild=createdAt']

  if (limit) {
    collectionQueryParams.push(`limitToFirst=${limit}`)
  }

  if (includeDraft) {
    collectionsToLoad.push({
      path: 'drafts',
      queryParams: collectionQueryParams,
    })
  }

  if (includePublished) {
    collectionsToLoad.push({
      path: 'articles',
      queryParams: collectionQueryParams,
    })
  }

  useFirebaseConnect(collectionsToLoad)

  const articles = useSelector(state => {
    if (!includePublished) {
      return []
    }

    return state.firebase.ordered.articles
  }) || []
  const drafts = useSelector(state => {
    if (!includeDraft) {
      return []
    }

    return state.firebase.ordered.drafts
  }) || []

  let allArticles = [
    ...articles,
    ...drafts,
  ]

  allArticles.sort(({ value: articleA }, { value: articleB }) => {
    if (articleA.createdAt < articleB.createdAt) {
      return 1
    }

    if (articleA.createdAt > articleB.createdAt) {
      return -1
    }

    return 0
  })

  if (limit) {
    allArticles = allArticles.slice(0, limit)
  }

  if ((includePublished && !isLoaded(articles)) || (includeDraft && !isLoaded(drafts))) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <ol className={classnames('article-list', className)}>
      {allArticles.map(({ key }) => (
        <li key={key}>
          <Article
            editMode={editMode}
            id={key}
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
