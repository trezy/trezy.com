import { combineReducers } from 'redux'
import articles from './articles'
import currentUserID from './currentUserID'
import movies from './movies'
import moviesSearchResults from './moviesSearchResults'
import users from './users'





export default combineReducers({
  articles,
  currentUserID,
  movies,
  moviesSearchResults,
  users,
})
