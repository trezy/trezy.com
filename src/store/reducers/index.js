// Module imports
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'





// Local imports
import movies from 'store/reducers/movies'
import moviesSearchResults from 'store/reducers/moviesSearchResults'





export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  movies,
  moviesSearchResults,
})
