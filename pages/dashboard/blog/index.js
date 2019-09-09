// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import { actions } from '../../../store'
import ArticleList from '../../../components/ArticleList'
import PageWrapper from '../../../components/PageWrapper'
import requireAuthentication from '../../../components/requireAuthentication'





const BlogDashboard = () => (
  <PageWrapper title="Blog Dashboard">
    <section>
      <header className="page-header">
        <h2>Dashboard / Blog</h2>

        <Link href="/dashboard/blog/edit/new">
          <a className="button primary">
            New Article
          </a>
        </Link>
      </header>

      <ArticleList editMode />
    </section>
  </PageWrapper>
)

BlogDashboard.getInitialProps = async ({ store }) => {
  await store.dispatch(actions.getArticles())
}





export default requireAuthentication(BlogDashboard)
