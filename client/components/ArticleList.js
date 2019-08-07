// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../store'
import Article from './Article'
import getArticlesSelector from '../store/selectors/getArticlesSelector'





const ArticleList = ({ className, editMode, includeDrafts, limit }) => {
  const articles = useSelector(getArticlesSelector())
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const getArticles = async () => {
    setIsLoading(true)
    await dispatch(actions.getArticles({
      includeDrafts,
      limit,
    }))
    setIsLoaded(true)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      getArticles()
    }
  })

  if (!isLoaded) {
    return 'Loading...'
  }

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
  includeDrafts: false,
  limit: false,
}

ArticleList.propTypes = {
  className: PropTypes.string,
  editMode: PropTypes.bool,
  includeDrafts: PropTypes.bool,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
}





export default ArticleList
