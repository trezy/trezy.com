// Module imports
import React, {
  useEffect,
} from 'react'
import {
  isEmpty,
  isLoaded,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Link from 'next/link'
import marked from 'marked'
import Prism from 'prismjs'
import PropTypes from 'prop-types'





// Component imports
import ArticleHeader from './ArticleHeader'
import ArticleMeta from './ArticleMeta'





const Article = props => {
  const {
    editMode,
    id,
    shouldLoad,
    summarize,
  } = props

  let collectionsToLoad = []

  if (shouldLoad) {
    collectionsToLoad = [
      {
        path: 'articles',
        queryParams: [id],
      },
      {
        path: 'drafts',
        queryParams: [id],
      },
    ]
  }

  useFirebaseConnect(collectionsToLoad)

  const article = useSelector(state => {
    let result = state.firebase.data.drafts?.[id]

    if (!result) {
      result = state.firebase.data.articles?.[id]
    }

    return result
  })

  useEffect(() => {
    if (isLoaded(article) && !isEmpty(article)) {
      setTimeout(() => Prism.highlightAll(), 0)
    }
  }, [article])

  if (!isLoaded(article)) {
    return (
      <div>Loading...</div>
    )
  }

  const {
    createdAt,
    publishedAt,
    subtitle,
    title,
    updatedAt,
  } = article

  return (
    <article className={classnames({ summary: summarize })}>
      <ArticleHeader {...{
        id,
        subtitle,
        summarize,
        title,
      }} />

      <ArticleMeta {...{
        createdAt,
        publishedAt,
        updatedAt,
      }} />

      {!summarize && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: marked(article.body) }} />
        </>
      )}

      {editMode && (
        <menu type="toolbar">
          <Link href={`/dashboard/blog/edit/${id}`}>
            <a className="button primary">
              Edit
            </a>
          </Link>
        </menu>
      )}
    </article>
  )
}

Article.defaultProps = {
  editMode: false,
  id: null,
  shouldLoad: true,
  summarize: false,
}

Article.propTypes = {
  editMode: PropTypes.bool,
  id: PropTypes.string,
  shouldLoad: PropTypes.bool,
  summarize: PropTypes.bool,
}





export default Article
