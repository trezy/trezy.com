// Module imports
import React, {
  useEffect,
} from 'react'
import classnames from 'classnames'
import marked from 'marked'
import Prism from 'prismjs'
import PropTypes from 'prop-types'





// Component imports
import { Link } from '../routes'
import ArticleHeader from './ArticleHeader'
import ArticleMeta from './ArticleMeta'





const Article = ({ article, editMode, summarize }) => {
  const {
    createdAt,
    id,
    publishedAt,
    title,
    updatedAt,
  } = article

  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0)
  }, [])

  return (
    <article className={classnames({ summary: summarize })}>
      <ArticleHeader {...{
        id,
        summarize,
        title,
      }} />

      <ArticleMeta {...{
        createdAt,
        publishedAt,
        updatedAt,
      }} />

      {(summarize && !article.excerpt) && (
        <div>
          Uuuuuuuugh... Trezy didn't enter an excerpt for this article. You should harass him into fixing it.
        </div>
      )}

      {(!summarize || (summarize && article.excerpt)) && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: marked(summarize ? (article.excerpt || '') : article.body) }} />
        </>
      )}

      {editMode && (
        <menu type="toolbar">
          <Link
            params={{ id }}
            route="edit article">
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
  summarize: false,
}

Article.propTypes = {
  article: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
  summarize: PropTypes.bool,
}





export default Article
