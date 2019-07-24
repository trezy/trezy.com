import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function moviesSearchResultsReducer (state = initialState.users, action) {
  const {
    payload,
    status,
    type,
  } = action
  const newState = { ...state }

  switch (type) {
    case actionTypes.FIND_MOVIES:
      switch (status) {
        case 'success':
          newState.movies = payload.results.map(({ id }) => id)
          newState.totalResults = payload.totalResults
          return newState

        default:
          return state
      }

    default:
      return state
  }
}
