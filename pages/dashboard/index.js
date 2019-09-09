// Module imports
import React from 'react'





// Component imports
import MovieSearch from '../../components/MovieSearch'
import PageWrapper from '../../components/PageWrapper'
import requireAuthentication from '../../components/requireAuthentication'





const Dashboard = () => (
  <PageWrapper title="Dashboard">
    <section>
      <header>
        <h2>Dashboard</h2>
      </header>

      <MovieSearch />
    </section>
  </PageWrapper>
)





export default requireAuthentication(Dashboard)
