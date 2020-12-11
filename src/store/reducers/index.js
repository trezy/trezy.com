// Module imports
import { combineReducers } from 'redux'





// Local imports
import movies from 'store/reducers/movies'
import moviesSearchResults from 'store/reducers/moviesSearchResults'





export default combineReducers({
	movies,
	moviesSearchResults,
})
