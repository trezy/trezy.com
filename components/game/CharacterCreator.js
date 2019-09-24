// Module imports
import React, { useState } from 'react'
import PropTypes from 'prop-types'





// Local imports
import {
  firebase,
  firebaseApp,
} from '../../helpers/firebase'
import CharacterPreview from './CharacterPreview'





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterCreator = ({ onSubmit, ownerID }) => {
  const [profession, setProfession] = useState('')
  const [color, setColor] = useState('#ffffff')
  const [name, setName] = useState('')
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)

  const _onSubmit = async event => {
    event.preventDefault()

    const database = firebaseApp.database()

    const firestore = firebaseApp.firestore()
    const characterCollection = firestore.collection('characters')

    setIsCreatingCharacter(true)

    const characterDoc = await characterCollection.add({
      profession,
      color,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      name,
      ownerID,
      size: 'medium',
    })

    const { id } = characterDoc

    await database.ref(`game/characters/${id}`).set({
      id,
      ownerID,
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
          <label>Class</label>

          <select
            onChange={({ target: { value } }) => setProfession(value)}
            value={profession}>
            <option>Select your class...</option>
            <option value="cleric">Cleric</option>
            <option value="ranger">Ranger</option>
            <option value="rogue">Rogue</option>
            <option value="warrior">Warrior</option>
            <option value="wizard">Wizard</option>
          </select>
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