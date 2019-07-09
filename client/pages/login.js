// Module imports
import * as firebase from 'firebase/app'
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import withFirebaseAuth from 'react-with-firebase-auth'





// Component imports
import firebaseConfig from '../../firebase.config'
import PageWrapper from '../components/PageWrapper'
import { Router } from '../routes'





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()





const Login = props => {
  const {
    signInWithGithub,
    signInWithGoogle,
    signOut,
    user,
  } = props

  useEffect(() => {
    if (user) {
      Router.push('/dashboard')
    }
  })

  console.log(props)

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
  signOut: PropTypes.func.isRequired,
  user: PropTypes.object,
}





export default withFirebaseAuth({
  firebaseAppAuth,
  providers: {
    githubProvider: new firebase.auth.GithubAuthProvider(),
    googleProvider: new firebase.auth.GoogleAuthProvider(),
  },
})(Login)
