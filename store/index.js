// Module imports
import {
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports
import initialState from './initialState'
import reducer from './reducers'



// Action imports
import * as moviesActions from './actions/movies'





const actions = {
  ...moviesActions,
}





const initStore = (state = initialState) => createStore(reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)))





export {
  actions,
  initStore,
}
