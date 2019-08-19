// Module imports
import { useSelector } from 'react-redux'
import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Component imports
import Article from './Article'
import getArticlesSelector from '../store/selectors/getArticlesSelector'





const ArticleList = ({ className, editMode }) => {
  const articles = useSelector(getArticlesSelector())

  return (
    <ol className={classnames('article-list', className)}>
      {articles.map(article => (
        <li key={article.id}>
          <Article
            article={article}
            editMode={editMode}
            summarize />
        </li>
      ))}
    </ol>
  )
}

ArticleList.defaultProps = {
  className: '',
  editMode: false,
}

ArticleList.propTypes = {
  className: PropTypes.string,
  editMode: PropTypes.bool,
}





export default ArticleList
