import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function currentUserReducer (state = initialState.currentUserID, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_CURRENT_USER:
      switch (status) {
        case 'success':
          return payload.uid

        default:
          return state
      }

    default:
      return state
  }
}
