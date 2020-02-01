// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import Article from '../../components/Article'
import createTitleStringFromArticle from '../../helpers/createTitleStringFromArticle'
import PageWrapper from '../../components/PageWrapper'
import useArticleSelector from '../../store/selectors/useArticleSelector'
import useClaimsSelector from '../../store/selectors/useClaimsSelector'





const ArticlePage = ({ slug }) => {
  const claims = useClaimsSelector()
  const where = []

  if (!claims['actions.article.viewDraft']) {
    where.push(['isDraft', '==', false])
  }

  where.push(['slug', '==', slug])

  useFirestoreConnect([
    {
      collection: 'articles',
      where,
    },
  ])

  const article = useArticleSelector(slug)

  if (!isLoaded(article)) {
    return (
      <PageWrapper title="Loading...">
        <section>Loading...</section>
      </PageWrapper>
    )
  }

  if (isEmpty(article)) {
    return (
      <PageWrapper
        description="Article not found"
        title="Article not found">
        <section>
          Article not found
        </section>
      </PageWrapper>
    )
  }

  const {
    id,
    synopsis,
  } = article

  return (
    <PageWrapper
      description={synopsis}
      title={createTitleStringFromArticle(article)}>
      <section>
        <article className="line-numbers">
          {article && (
            <Article id={id} />
          )}
        </article>
      </section>
    </PageWrapper>
  )
}

ArticlePage.getInitialProps = async ({ query }) => {
  const firestore = getFirestore()

  await firestore.get({
    collection: 'articles',
    where: [
      ['isDraft', '==', false],
      ['slug', '==', query.slug],
    ],
  })

  return {
    slug: query.slug,
  }
}

ArticlePage.propTypes = {
  slug: PropTypes.string.isRequired,
}





export default ArticlePage
