import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function usersReducer (state = initialState.users, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_CURRENT_USER:
      switch (status) {
        case 'success':
          return {
            ...state,
            [payload.uid]: payload,
          }

        default:
          return state
      }

    default:
      return state
  }
}
