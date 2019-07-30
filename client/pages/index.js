// Module imports
import React from 'react'





// Component imports
import ArticleList from '../components/ArticleList'
import ClientList from '../components/ClientList'
import PageWrapper from '../components/PageWrapper'





const Home = () => (
  <PageWrapper title="Home">
    <section>
      <div>
        <header>Latest article</header>

        <ArticleList limit={1} />
      </div>
    </section>

    <section className="hero">
      <header>Trusted by:</header>

      <ClientList />
    </section>
  </PageWrapper>
)





export default Home
