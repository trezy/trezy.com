// Module imports
import * as firebase from 'firebase/app'
import 'firebase/auth' /* eslint-disable-line import/no-unassigned-import */





// Component imports
import actionTypes from '../actionTypes'
import firebaseConfig from '../../../firebase.config'
import parseUserFromFirebase from '../../helpers/parseUserFromFirebase'





// Local constants
const firebaseApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()





export const getCurrentUser = () => async dispatch => {
  let user = null

  if (firebaseAppAuth.currentUser) {
    user = firebaseAppAuth.currentUser
  }

  if (!user) {
    user = await new Promise(resolve => firebaseAppAuth.onAuthStateChanged(resolve))
  }

  dispatch({
    payload: parseUserFromFirebase(user),
    status: user ? 'success' : 'failure',
    type: actionTypes.GET_CURRENT_USER,
  })
}

export const getUsers = () => () => ({
  payload: {},
  status: 'success',
  type: actionTypes.GET_USERS,
})
