// Module imports
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */

import Router from 'next/router'





// Local imports
import { firebaseApp } from '../helpers/firebase'
import parseUserFromFirebase from '../helpers/parseUserFromFirebase'





// Local constants
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
