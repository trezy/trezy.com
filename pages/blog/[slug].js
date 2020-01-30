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
import createTitleStringFromArticle from '../../helpers/createTitleStringFromArticle'
import PageWrapper from '../../components/PageWrapper'
import useArticle from '../../store/selectors/useArticle'





const ArticlePage = ({ slug }) => {
  useFirestoreConnect([
    {
      collection: 'articles',
      where: ['slug', '==', slug],
    },
  ])

  const article = useSelector(useArticle(slug))

  if (!isLoaded(article)) {
    return (
      <PageWrapper title="Loading...">
        <section>Loading...</section>
      </PageWrapper>
    )
  }

  const {
    id,
    synopsis,
  } = article

  return (
    <PageWrapper
      description={article ? synopsis : 'Article not found'}
      title={article ? createTitleStringFromArticle(article) : 'Article not found'}>
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
    where: ['slug', '==', query.slug],
  })

  return {
    slug: query.slug,
  }
}

ArticlePage.propTypes = {
  slug: PropTypes.string.isRequired,
}





export default ArticlePage
