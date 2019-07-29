// Module imports
import * as firebase from 'firebase/app'
/* eslint-disable import/no-unassigned-import */
import 'firebase/firestore'
import 'firebase/auth'
/* eslint-enable */





// Local imports
import firebaseConfig from '../../firebase.config'





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
