import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function gameReducer (state = initialState.game, action) {
  const {
    payload,
    type,
  } = action
  const newState = { ...state }

  switch (type) {
    case actionTypes.UPDATE_CHARACTERS:
      newState.characters = payload

      return newState

    default:
      return state
  }
}
