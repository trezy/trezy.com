// Module imports
import {
	createStore,
	applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports
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
	),
)





export {
	actions,
	initStore,
}
