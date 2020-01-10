// Module imports
import {
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { useSelector } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import Article from '../../components/Article'
import PageWrapper from '../../components/PageWrapper'





const ArticlePage = ({ id }) => {
  useFirestoreConnect([
    {
      collection: 'articles',
      doc: id,
    },
  ])

  const article = useSelector(state => state.firestore.data.articles?.[id])

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
  const firestore = getFirestore()

  await firestore.get({
    collection: 'articles',
    doc: query.id,
  })

  return {
    id: query.id,
  }
}

ArticlePage.propTypes = {
  id: PropTypes.string.isRequired,
}





export default ArticlePage
