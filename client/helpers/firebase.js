// Module imports
import * as firebase from 'firebase/app'
/* eslint-disable import/no-unassigned-import */
import 'firebase/auth'
import 'firebase/database'
/* eslint-enable */

import getConfig from 'next/config'





// Local constants
const { publicRuntimeConfig } = getConfig()
const firebaseConfig = publicRuntimeConfig.apis.firebase





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)
const providers = {
  githubProvider: new firebase.auth.GithubAuthProvider,
  googleProvider: new firebase.auth.GoogleAuthProvider,
  twitterProvider: new firebase.auth.TwitterAuthProvider,
}





export {
  firebase,
  firebaseApp,
  providers,
}
