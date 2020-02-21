// Module imports
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

          <Link
            as="/dashboard/blog/edit/new"
            href="/dashboard/blog/edit/[id]">
            <a className="button primary">
              New Article
            </a>
          </Link>
        </header>

        <ArticleList
          editMode
          includeDraft />
      </section>
    </RequireAuthentication>
  </PageWrapper>
)





export default BlogDashboard
