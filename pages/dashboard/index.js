// Module imports
import { getFirestore } from 'redux-firestore'
import React from 'react'





// Component imports
import ArticleList from '../../components/ArticleList'
// import MovieSearch from '../../components/MovieSearch'
import PageWrapper from '../../components/PageWrapper'
import RequireAuthentication from '../../components/RequireAuthentication'





// Local constants
const ARTICLE_LIMIT = 3





const Dashboard = () => (
  <PageWrapper title="Dashboard">
    <RequireAuthentication>
      <section>
        <header>
          <h2>Recent Articles</h2>
        </header>

        <ArticleList
          editMode
          includeDraft
          limit={ARTICLE_LIMIT} />

        {/* <MovieSearch /> */}
      </section>
    </RequireAuthentication>
  </PageWrapper>
)

Dashboard.getInitialProps = async () => {
  const firestore = getFirestore()

  await firestore.get({
    collection: 'articles',
    limit: ARTICLE_LIMIT,
    orderBy: ['updatedAt', 'desc'],
    where: ['isDraft', '==', true],
  })

  return {}
}





export default Dashboard
