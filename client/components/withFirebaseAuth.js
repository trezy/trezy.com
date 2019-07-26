// Module imports
import * as firebase from 'firebase/app'
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */

import React, {
  useEffect,
} from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import withFirebaseAuth from 'react-with-firebase-auth'





// Component imports
import { actions } from '../store'
import firebaseConfig from '../../firebase.config'





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)
let previousUser = null





const withFirebaseAuthWrapper = Component => {
  const ComponentWithFirebaseAuth = props => {
    const dispatch = useDispatch()

    const { user: currentUser } = props

    useEffect(() => {
      if (currentUser !== previousUser) {
        dispatch(actions.getCurrentUser())
      }

      return () => {
        previousUser = currentUser
      }
    })

    return (
      <Component
        {...props}
        firebaseApp={firebaseApp} />
    )
  }

  ComponentWithFirebaseAuth.defaultProps = {
    user: null,
  }

  ComponentWithFirebaseAuth.propTypes = {
    user: PropTypes.object,
  }

  return withFirebaseAuth({
    firebaseAppAuth: firebaseApp.auth(),
    providers: {
      githubProvider: new firebase.auth.GithubAuthProvider(),
      googleProvider: new firebase.auth.GoogleAuthProvider(),
      twitterProvider: new firebase.auth.TwitterAuthProvider(),
    },
  })(ComponentWithFirebaseAuth)
}

export default withFirebaseAuthWrapper
