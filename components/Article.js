// Module imports
import React, {
  useEffect,
} from 'react'
import {
  isEmpty,
  isLoaded,
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
    summarize,
  } = props

  const article = useSelector(state => state.firestore.data.articles?.[id])

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
    isDraft,
    publishedAt,
    slug,
    subtitle,
    synopsis,
    title,
    updatedAt,
  } = article

  return (
    <article className={classnames({ summary: summarize })}>
      <ArticleHeader {...{
        slug,
        subtitle,
        summarize,
        title,
      }} />

      <ArticleMeta {...{
        createdAt,
        isDraft,
        publishedAt,
        updatedAt,
      }} />

      {synopsis && (
        <span className="synopsis">
          {synopsis}
        </span>
      )}

      {!summarize && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: marked(article.body) }} />
        </>
      )}

      {editMode && (
        <menu type="toolbar">
          <Link
            as={`/dashboard/blog/edit/${id}`}
            href="/dashboard/blog/edit/[id]">
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
  summarize: false,
}

Article.propTypes = {
  editMode: PropTypes.bool,
  id: PropTypes.string,
  summarize: PropTypes.bool,
}





export default Article
