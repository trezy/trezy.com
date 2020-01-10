// Module imports
import React, {
  useEffect,
} from 'react'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Component imports
import PageWrapper from '../components/PageWrapper'





// Local variables
let redirectStarted = false





const Login = props => {
  const { destination } = props

  const firebase = useFirebase()
  const auth = useSelector(state => state.firebase.auth)

  useEffect(() => {
    if (auth.isLoaded && !auth.isEmpty && !redirectStarted) {
      const startRedirect = () => {
        redirectStarted = false
        Router.events.off('routeChangeComplete', startRedirect)
      }
      redirectStarted = true
      Router.replace(destination || '/dashboard')
      Router.events.on('routeChangeComplete', startRedirect)
    }
  })

  return (
    <PageWrapper title="Login">
      <section className="hero">
        <div>
          <h2>Login</h2>

          <menu type="toolbar">
            <button
              className="primary"
              onClick={() => firebase.login({
                provider: 'google',
                type: 'popup',
              })}
              type="button">
              Sign in with Google
            </button>

            <button
              className="primary"
              onClick={() => firebase.login({
                provider: 'github',
                type: 'popup',
              })}
              type="button">
              Sign in with Github
            </button>

            <button
              className="primary"
              onClick={() => firebase.login({
                provider: 'twitter',
                type: 'popup',
              })}
              type="button">
              Sign in with Twitter
            </button>
          </menu>
        </div>
      </section>
    </PageWrapper>
  )
}

Login.getInitialProps = ({ query }) => ({
  destination: query.destination,
})

Login.defaultProps = {
  destination: '',
}

Login.propTypes = {
  destination: PropTypes.string,
}





export default Login
