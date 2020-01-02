// Module imports
import { getFirebase } from 'react-redux-firebase'
import React from 'react'





// Component imports
import ArticleList from '../../components/ArticleList'
import PageWrapper from '../../components/PageWrapper'





const Blog = () => (
  <PageWrapper
    description="New ideas, old ideas, and regular ideas can all be found below the titles of Trezy's titular technological tidings."
    title="Blog">
    <section>
      <header>
        <h2>Blog</h2>
      </header>

      <ArticleList />
    </section>
  </PageWrapper>
)

Blog.getInitialProps = async () => {
  await getFirebase().promiseEvents([
    {
      path: 'articles',
      queryParams: ['orderByChild=createdAt'],
    },
  ])
}





export default Blog
