// Module imports
import React from 'react'





// Component imports
import { Link } from '../routes'
import ArticleList from '../components/ArticleList'
import ClientList from '../components/ClientList'
import PageWrapper from '../components/PageWrapper'





const Home = () => (
  <PageWrapper title="Home">
    <section className="branded hero">
      <header>
        &lt;trezy-who/&gt;
      </header>

      <p>Software engineer, UX designer, and <a href="https://a11yproject.com">#a11y</a>.</p>
    </section>

    <section>
      <div>
        <header>
          <h2>Latest articles</h2>
        </header>

        <ArticleList
          className="latest-articles"
          limit={3} />

        <Link route="blog">
          <a>See more</a>
        </Link>
      </div>
    </section>

    <section className="center">
      <p>As a software consultant, I've been lucky to work with some of the best teams from well-known brands on products that make the world a better place.</p>

      <ClientList />
    </section>
  </PageWrapper>
)





export default Home
