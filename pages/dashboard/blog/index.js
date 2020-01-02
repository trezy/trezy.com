// Module imports
import { getFirebase } from 'react-redux-firebase'
import Link from 'next/link'
import React from 'react'





// Component imports
import ArticleList from '../../../components/ArticleList'
import PageWrapper from '../../../components/PageWrapper'
import RequireAuthentication from '../../../components/RequireAuthentication'





const BlogDashboard = () => (
  <PageWrapper title="Blog Dashboard">
    <RequireAuthentication>
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
    </RequireAuthentication>
  </PageWrapper>
)

BlogDashboard.getInitialProps = async () => {
  await getFirebase().promiseEvents([
    {
      path: 'articles',
      queryParams: ['orderByChild=createdAt'],
    },
  ])
}





export default BlogDashboard
