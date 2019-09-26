// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import CharacterCreator from '../../components/game/CharacterCreator'
import CharacterPreview from '../../components/game/CharacterPreview'
import PageWrapper from '../../components/PageWrapper'
import requireAuthentication from '../../components/requireAuthentication'





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterSelect = ({
  currentUser,
  firebaseApp,
}) => {
  if (typeof window === 'undefined') {
    return null
  }

  const [characters, setCharacters] = useState([])
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true)

  const firestore = firebaseApp.firestore()
  const characterCollection = firestore.collection('characters')

  useEffect(() => characterCollection.where('ownerID', '==', currentUser.uid).onSnapshot(snapshot => {
    const newCharacters = [...(characters || [])]

    snapshot.forEach(doc => {
      newCharacters.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    setCharacters(newCharacters)

    if (isLoadingCharacters) {
      setIsLoadingCharacters(false)
    }
  }), [])

  // useEffect(() => {
  //   (async () => {
  //     const newCharacterList = []

  //     setIsLoadingCharacters(true)

  //     const characterDocs = await characterCollection.where('ownerID', '==', currentUser.uid).get()

  //     characterDocs.forEach(characterDoc => {
  //       newCharacterList.push({
  //         id: characterDoc.id,
  //         ...characterDoc.data(),
  //       })
  //     })

  //     setCharacters(newCharacterList)
  //     setIsLoadingCharacters(false)
  //   })()
  // }, [])

  return (
    <PageWrapper
      description="Select your character"
      title="Character Select | A Monster's Nature">
      <section>
        {isLoadingCharacters && (
          <span>Loading your characters...</span>
        )}

        {(!isLoadingCharacters && !characters.length) && (
          <span>No characters! <span aria-label="Disappointed emoji" role="img">😞</span></span>
        )}

        {(!isLoadingCharacters && Boolean(characters.length)) && (
          <ol className="character-list">
            {characters.map(character => (
              <li
                className="character"
                key={character.id}>
                <CharacterPreview
                  character={character}
                  mini />

                <span className="name">
                  {character.name}
                </span>

                <menu type="toolbar">
                  <Link as="/game" href={`/game?characterID=${character.id}`}>
                    <a className="button primary">
                      Select
                    </a>
                  </Link>

                  {/* <button
                    className="primary"
                    onClick={() => setCharacterID(character.id)}
                    type="button">
                    Select
                  </button> */}
                </menu>
              </li>
            ))}
          </ol>
        )}

        {!isLoadingCharacters && (
          <button
            className="primary"
            disabled={characters.length >= 10}
            onClick={() => setIsCreatingCharacter(true)}
            type="button">
            Create Character
          </button>
        )}
      </section>

      {isCreatingCharacter && (
        <dialog open>
          <CharacterCreator
            onSubmit={() => setIsCreatingCharacter(false)}
            ownerID={currentUser.uid} />
        </dialog>
      )}
    </PageWrapper>
  )
}

CharacterSelect.getInitialProps = (props, setLayoutProps) => setLayoutProps({ renderLayout: false })

CharacterSelect.defaultProps = {
  currentUser: null,
}

CharacterSelect.propTypes = {
  currentUser: PropTypes.object,
  firebaseApp: PropTypes.object.isRequired,
}





export default requireAuthentication(CharacterSelect)
