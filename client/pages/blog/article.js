// Module imports
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import React, {
  useEffect,
  useState,
} from 'react'
import marked from 'marked'
import Prism from 'prismjs'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../../store'
import getArticle from '../../store/selectors/getArticleSelector'
import PageWrapper from '../../components/PageWrapper'





const Article = ({ query: { id } }) => {
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

  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0)
  }, [article])

  return (
    <PageWrapper title={article ? article.title : 'Loading...'}>
      <section>
        <article className="line-numbers">
          {isLoading && (
            <span>Loading...</span>
          )}

          {(article && !isLoading) && (
            <>
              <header>
                <h2>{article.title}</h2>
              </header>

              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: marked(article.body) }} />
            </>
          )}
        </article>
      </section>
    </PageWrapper>
  )
}

Article.propTypes = {
  query: PropTypes.object.isRequired,
}





export default Article
