// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'





// Component imports
import { actions } from '../../store'
import getCurrentUserSelector from '../../store/selectors/getCurrentUser'
import MovieSearch from '../../components/MovieSearch'
import PageWrapper from '../../components/PageWrapper'





const Dashboard = () => {
  const dispatch = useDispatch()

  const currentUser = useSelector(getCurrentUserSelector)

  const [gettingCurrentUser, setGettingCurrentUser] = useState(false)

  useEffect(() => {
    if (!gettingCurrentUser && !currentUser) {
      setGettingCurrentUser(true)
      dispatch(actions.getCurrentUser())
    }

    if (gettingCurrentUser && currentUser) {
      setGettingCurrentUser(false)
    }
  })

  return (
    <PageWrapper title="Dashboard">
      <section>
        {gettingCurrentUser && (
          <h2>Loading...</h2>
        )}

        {(!gettingCurrentUser && currentUser) && (
          <>
            <header>
              <h2>Dashboard!</h2>
            </header>

            <MovieSearch />
          </>
        )}
      </section>
    </PageWrapper>
  )
}





export default Dashboard
