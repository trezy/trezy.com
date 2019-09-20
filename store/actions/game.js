// Local imports
import actionTypes from '../actionTypes'





/* eslint-disable-next-line import/prefer-default-export */
export const updateCharacters = characters => dispatch => {
  // const hasChanges = false
  // const payload = {}

  dispatch({
    payload: characters,
    type: actionTypes.UPDATE_CHARACTERS,
  })
}
