// Local imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function articlesReducer (state = initialState.articles, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_ARTICLES:
      switch (status) {
        case 'success':
          return {
            ...payload,
          }

        default:
          return state
      }

    case actionTypes.GET_ARTICLE:
    case actionTypes.SAVE_ARTICLE:
      switch (status) {
        case 'success':
          return {
            ...state,
            [payload.id]: payload,
          }

        default:
          return state
      }

    default:
      return state
  }
}
