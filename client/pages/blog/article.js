// Module imports
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import React, {
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../../store'
import getArticle from '../../store/selectors/getArticleSelector'
import Article from '../../components/Article'
import PageWrapper from '../../components/PageWrapper'





const ArticlePage = ({ query: { id } }) => {
  const article = useSelector(getArticle(id))
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const loadArticle = async () => {
    await dispatch(actions.getArticle(id))
    setIsLoading(false)
  }

  useEffect(() => {
    if (!article && !isLoading) {
      setIsLoading(true)
      loadArticle()
    }
  })

  return (
    <PageWrapper title={article ? article.title : 'Loading...'}>
      <section>
        <article className="line-numbers">
          {isLoading && (
            <span>Loading...</span>
          )}

          {(article && !isLoading) && (
            <Article article={article} />
          )}
        </article>
      </section>
    </PageWrapper>
  )
}

ArticlePage.propTypes = {
  query: PropTypes.object.isRequired,
}





export default ArticlePage
