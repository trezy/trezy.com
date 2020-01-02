// Module imports
import {
  getFirebase,
  isLoaded,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import Article from '../../components/Article'
import PageWrapper from '../../components/PageWrapper'





const ArticlePage = ({ query: { id } }) => {
  useFirebaseConnect([
    {
      path: 'articles',
      queryParams: [id],
    },
  ])

  const article = useSelector(state => state.firebase.data.articles?.[id])

  if (!isLoaded(article)) {
    return (
      <PageWrapper title="Loading...">
        <section>Loading...</section>
      </PageWrapper>
    )
  }

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
            <Article id={id} />
          )}

          {!article && 'Article not found'}
        </article>
      </section>
    </PageWrapper>
  )
}

ArticlePage.getInitialProps = async ({ query }) => {
  await getFirebase().promiseEvents([
    { path: `articles/${query.id}` },
  ])
}

ArticlePage.propTypes = {
  query: PropTypes.object.isRequired,
}





export default ArticlePage
