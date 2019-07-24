// Module imports
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'





// Component imports
import { Router } from '../routes'
import PageWrapper from '../components/PageWrapper'
import withFirebaseAuth from '../components/withFirebaseAuth'





const Login = props => {
  const {
    signInWithGithub,
    signInWithGoogle,
    signInWithTwitter,
    signOut,
    user,
  } = props

  useEffect(() => {
    if (user) {
      Router.push('/dashboard')
    }
  })

  return (
    <PageWrapper title="Login">
      <section className="hero">
        <div>
          <h2>Login</h2>

          {!user && (
            <menu type="toolbar">
              <button
                onClick={signInWithGoogle}
                type="button">
                Sign in with Google
              </button>

              <button
                onClick={signInWithGithub}
                type="button">
                Sign in with Github
              </button>

              <button
                onClick={signInWithTwitter}
                type="button">
                Sign in with Twitter
              </button>
            </menu>
          )}

          {user && (
            <menu type="toolbar">
              <button
                onClick={signOut}
                type="button">
                Sign out
              </button>
            </menu>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}

Login.defaultProps = {
  user: null,
}

Login.propTypes = {
  signInWithGithub: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithTwitter: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  user: PropTypes.object,
}





export default withFirebaseAuth(Login)
