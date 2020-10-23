// Module imports
import {
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { reduxFirestore } from 'redux-firestore'
import thunkMiddleware from 'redux-thunk'





// Component imports
import firebase from 'helpers/firebase'
import initialState from 'store/initialState'
import reducer from 'store/reducers'





// Action imports
import * as moviesActions from 'store/actions/movies'





const actions = { ...moviesActions }





const initStore = (state = initialState) => createStore(
  reducer,
  state,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware),
    reduxFirestore(firebase),
  ),
)





export {
  actions,
  initStore,
}
