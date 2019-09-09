// Local imports
import { firebaseApp } from '../../helpers/firebase'
import actionTypes from '../actionTypes'
import parseUserFromFirebase from '../../helpers/parseUserFromFirebase'





// Local constants
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
