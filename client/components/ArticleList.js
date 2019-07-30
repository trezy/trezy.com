// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../store'
import { Link } from '../routes'
import getArticlesSelector from '../store/selectors/getArticlesSelector'





const ArticleList = ({ limit }) => {
  const articles = useSelector(getArticlesSelector())
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const getArticles = async () => {
    setIsLoading(true)
    await dispatch(actions.getArticles(limit))
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
    <ol className="article-list">
      {articles.map(({ id, publishedAt, title }) => (
        <li key={id}>
          <article>
            <header>
              <h3>
                <Link
                  params={{ id }}
                  route="view article">
                  <a>
                    {title}
                  </a>
                </Link>
              </h3>
            </header>

            <div className="meta">
              <span>Published {moment(publishedAt.seconds * 1000).format('D MMMM, Y')}</span>
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}

ArticleList.defaultProps = {
  limit: false,
}

ArticleList.propTypes = {
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
}





export default ArticleList
