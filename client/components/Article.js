// Module imports
import React, {
  useEffect,
} from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import marked from 'marked'
import Prism from 'prismjs'
import PropTypes from 'prop-types'





// Component imports
import ArticleHeader from './ArticleHeader'
import ArticleMeta from './ArticleMeta'





const Article = ({ article, editMode, summarize }) => {
  const {
    createdAt,
    id,
    publishedAt,
    subtitle,
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
  summarize: false,
}

Article.propTypes = {
  article: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
  summarize: PropTypes.bool,
}





export default Article
