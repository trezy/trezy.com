// Module imports
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Component imports
import PageWrapper from '../components/PageWrapper'
import withFirebaseAuth from '../components/withFirebaseAuth'





// Local variables
let redirectStarted = false





const Login = props => {
  const {
    signInWithGithub,
    signInWithGoogle,
    signInWithTwitter,
    query,
    user: currentUser,
  } = props

  useEffect(() => {
    if (currentUser && !redirectStarted) {
      const startRedirect = () => {
        redirectStarted = false
        Router.events.off('routeChangeComplete', startRedirect)
      }
      redirectStarted = true
      Router.replace(query.destination || '/dashboard')
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
              onClick={signInWithGoogle}
              type="button">
              Sign in with Google
            </button>

            <button
              className="primary"
              onClick={signInWithGithub}
              type="button">
              Sign in with Github
            </button>

            <button
              className="primary"
              onClick={signInWithTwitter}
              type="button">
              Sign in with Twitter
            </button>
          </menu>
        </div>
      </section>
    </PageWrapper>
  )
}

Login.defaultProps = {
  user: null,
}

Login.propTypes = {
  query: PropTypes.object.isRequired,
  signInWithGithub: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithTwitter: PropTypes.func.isRequired,
  user: PropTypes.object,
}





export default withFirebaseAuth(Login)
