// Module imports
import React from 'react'





// Component imports
import ArticleList from '../components/ArticleList'
import PageWrapper from '../components/PageWrapper'





const Home = () => (
  <PageWrapper title="Home">
    <section>
      <ArticleList limit={1} />
    </section>
  </PageWrapper>
)





export default Home
