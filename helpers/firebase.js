// Module imports
import firebase from 'firebase/app'
/* eslint-disable import/no-unassigned-import */
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
/* eslint-enable import/no-unassigned-import */





// Local imports
import firebaseConfig from '../firebase.config'





if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  firebase.database()
  firebase.firestore()
}





export default firebase
