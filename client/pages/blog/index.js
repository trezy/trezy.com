// Module imports
import React from 'react'





// Component imports
import ArticleList from '../../components/ArticleList'
import PageWrapper from '../../components/PageWrapper'





const Blog = () => (
  <PageWrapper title="Blog">
    <section>
      <header>
        <h2>Blog</h2>
      </header>

      <ArticleList />
    </section>
  </PageWrapper>
)





export default Blog
