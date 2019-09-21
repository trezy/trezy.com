// Module imports
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Local imports
import { firebaseApp } from '../../helpers/firebase'
import CharacterPreview from './CharacterPreview'





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterCreator = ({ onSubmit, ownerID }) => {
  const [color, setColor] = useState('#ffffff')
  const [name, setName] = useState('')
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)

  const _onSubmit = async event => {
    event.preventDefault()

    const database = firebaseApp.database()
    const id = uuid()

    setIsCreatingCharacter(true)

    await database.ref(`game/characters/${id}`).set({
      color,
      id,
      name,
      ownerID,
      size: 'medium',
      x: 0,
      y: 0,
    })

    setIsCreatingCharacter(false)

    setTimeout(() => onSubmit(), 500)
  }

  return (
    <>
      <form onSubmit={_onSubmit}>
        <fieldset>
          <label>Name</label>

          <input
            onChange={({ target: { value } }) => setName(value)}
            placeholder="e.g. Jon Snow"
            type="text"
            value={name} />
        </fieldset>

        <fieldset>
          <label>Color</label>

          <input
            onChange={({ target: { value } }) => setColor(value)}
            type="color"
            value={color} />
        </fieldset>

        <button
          className="primary"
          disabled={!name || isCreatingCharacter}
          type="submit">
          {!isCreatingCharacter && (
            <span>Create</span>
          )}

          {isCreatingCharacter && (
            <span>Saving...</span>
          )}
        </button>
      </form>

      <CharacterPreview character={{
        color,
        name,
        size: 'medium',
      }} />
    </>
  )
}

CharacterCreator.defaultProps = {
  onSubmit: () => {},
}

CharacterCreator.propTypes = {
  onSubmit: PropTypes.func,
  ownerID: PropTypes.string.isRequired,
}
/* eslint-enable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */





export default CharacterCreator
