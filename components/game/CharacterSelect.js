// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { firebaseApp } from '../../helpers/firebase'
import CharacterCreator from './CharacterCreator'
import CharacterPreview from './CharacterPreview'





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const Game = ({
  onSelect,
  ownerID,
}) => {
  const [characters, setCharacters] = useState([])
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true)

  const database = firebaseApp.database()

  useEffect(() => {
    setIsLoadingCharacters(true)

    database.ref('game/characters').orderByChild('ownerID').equalTo(ownerID).on('value', snapshot => {
      setCharacters(Object.values(snapshot.val()))
      setIsLoadingCharacters(false)
    })
  }, [])

  return (
    <div className="character-select">
      <section>
        {isLoadingCharacters && (
          <span>Loading your characters...</span>
        )}

        {(!isLoadingCharacters && !characters.length) && (
          <span>No characters! <span aria-label="Disappointed emoji" role="img">😞</span></span>
        )}

        {(!isLoadingCharacters && characters.length) && (
          <>
            <ol className="character-list">
              {characters.map(character => (
                <li
                  className="character"
                  key={character.id}>
                  <CharacterPreview
                    character={character}
                    mini />

                  {character.name}

                  <menu type="toolbar">
                    <button
                      className="primary"
                      onClick={() => onSelect(character.id)}
                      type="button">
                      Select
                    </button>
                  </menu>
                </li>
              ))}
            </ol>

            <button
              className="primary"
              disabled={characters.length >= 10}
              onClick={() => setIsCreatingCharacter(true)}
              type="button">
              Create Character
            </button>
          </>
        )}
      </section>

      {isCreatingCharacter && (
        <dialog open>
          <CharacterCreator
            onSubmit={() => setIsCreatingCharacter(false)}
            ownerID={ownerID} />
        </dialog>
      )}
    </div>
  )
}

Game.defaultProps = {
  onSelect: () => {},
}

Game.propTypes = {
  onSelect: PropTypes.func,
  ownerID: PropTypes.string.isRequired,
}





export default Game
