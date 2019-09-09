// Module imports
import { useSelector } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../../store'
import getArticle from '../../store/selectors/getArticleSelector'
import Article from '../../components/Article'
import PageWrapper from '../../components/PageWrapper'





const ArticlePage = ({ query: { id } }) => {
  const article = useSelector(getArticle(id))
  const {
    subtitle,
    title,
  } = article

  return (
    <PageWrapper
      description={article ? subtitle : 'Article not found'}
      title={article ? title : 'Article not found'}>
      <section>
        <article className="line-numbers">
          {article && (
            <Article article={article} />
          )}

          {!article && 'Article not found'}
        </article>
      </section>
    </PageWrapper>
  )
}

ArticlePage.getInitialProps = async ({ query, store }) => {
  await store.dispatch(actions.getArticle(query.id))
}

ArticlePage.propTypes = {
  /* eslint-disable-next-line react/no-unused-prop-types */
  query: PropTypes.object.isRequired,
}





export default ArticlePage
