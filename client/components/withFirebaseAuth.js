// Module imports
import * as firebase from 'firebase/app'
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */

import React from 'react'
import withFirebaseAuth from 'react-with-firebase-auth'





// Component imports
import firebaseConfig from '../../firebase.config'





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)





const withFirebaseAuthWrapper = Component => {
  const ComponentWithFirebaseAuth = props => (
    <Component
      firebaseApp={firebaseApp}
      {...props} />
  )

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
