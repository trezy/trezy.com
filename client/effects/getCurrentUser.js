// Module imports
import * as firebase from 'firebase/app'
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */





// Component imports
import { Router } from '../routes'
import firebaseConfig from '../../firebase.config'
import parseUserFromFirebase from '../helpers/parseUserFromFirebase'





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()





/* eslint-disable consistent-return */
const getCurrentUser = (callback, redirectIfNotLoggedIn) => () => {
  if (firebaseAppAuth.currentUser) {
    callback(parseUserFromFirebase(firebaseAppAuth.currentUser))
  }

  const unsubscribe = firebaseAppAuth.onAuthStateChanged(user => {
    callback(parseUserFromFirebase(user))

    if (!user && redirectIfNotLoggedIn) {
      let redirectDestination = '/login'

      if (typeof redirectIfNotLoggedIn === 'string') {
        redirectDestination = redirectIfNotLoggedIn
      }

      Router.push(redirectDestination)
    }
  })

  return unsubscribe
}
/* eslint-enable */





export default getCurrentUser