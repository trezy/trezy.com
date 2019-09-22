// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  useDispatch,
  useStore,
} from 'react-redux'
import PropTypes from 'prop-types'





// Local imports
import { actions } from '../store'
import CharacterSelect from '../components/game/CharacterSelect'
import PageWrapper from '../components/PageWrapper'
import requireAuthentication from '../components/requireAuthentication'





// Local constants
const characterSizes = {
  small: 50,
  medium: 100,
  large: 200,
}





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const Game = ({
  currentUser,
  firebaseApp,
}) => {
  if (typeof window === 'undefined') {
    return null
  }

  const canvasElement = useRef(null)
  const keysPressed = {}
  const dispatch = useDispatch()
  const store = useStore()
  const [characterID, setCharacterID] = useState(null)
  const [character, setCharacter] = useState(null)
  const [{ height, width }, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  const database = firebaseApp.database()
  const characterCollection = database.ref('game/characters')

  useEffect(() => {
    if (!character && characterID) {
      database.ref(`game/characters/${characterID}`).on('value', snapshot => setCharacter(snapshot.val()))
    } else {
      database.ref(`game/characters/${characterID}`).off('value')
      setCharacterID(null)
    }
  }, [character, characterID])

  useEffect(() => {
    const handleKeydownEvent = ({ key }) => {
      keysPressed[key] = true
    }

    const handleKeyupEvent = ({ key }) => delete keysPressed[key]

    const handleResizeEvent = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }

    if (character) {
      const myCharacterRef = database.ref(`game/characters/${characterID}`)

      characterCollection.on('value', snapshot => {
        const value = snapshot.val()

        dispatch(actions.updateCharacters(value))
      })

      const drawCharacter = (context, characterData) => {
        context.fillStyle = characterData.color
        context.lineWidth = 4
        context.strokeStyle = 'black'

        context.fillRect(
          Math.floor(characterData.x),
          Math.floor(characterData.y),
          Math.floor(characterSizes[characterData.size]),
          Math.floor(characterSizes[characterData.size]),
        )
        context.strokeRect(
          Math.floor(characterData.x),
          Math.floor(characterData.y),
          Math.floor(characterSizes[characterData.size]),
          Math.floor(characterSizes[characterData.size]),
        )

        context.font = '1em serif'
        context.fillStyle = 'black'
        context.fillText(
          characterData.name,
          Math.floor(characterData.x),
          Math.floor(characterData.y - 5),
        )
      }

      window.addEventListener('resize', handleResizeEvent)

      window.addEventListener('keydown', handleKeydownEvent)

      window.addEventListener('keyup', handleKeyupEvent)

      const gameLoop = () => {
        if (canvasElement.current) {
          const {
            game: { characters },
          } = store.getState()
          const myCharacter = characters[characterID]

          if (myCharacter) {
            const context = canvasElement.current.getContext('2d')

            context.clearRect(0, 0, context.canvas.width, context.canvas.height)

            Object.values(characters).forEach(characterData => {
              drawCharacter(context, characterData)
            })

            let newX = myCharacter.x
            let newY = myCharacter.y

            if (keysPressed.w) {
              newY -= 10
            }

            if (keysPressed.s) {
              newY += 10
            }

            if (keysPressed.a) {
              newX -= 10
            }

            if (keysPressed.d) {
              newX += 10
            }

            if ((newY !== myCharacter.y) || (newX !== myCharacter.x)) {
              myCharacterRef.update({
                ...myCharacter,
                x: newX,
                y: newY,
              })
            }
          }
        }

        requestAnimationFrame(gameLoop)
      }

      gameLoop()
    }
  }, [character])

  return (
    <PageWrapper
      description="The MMOment you've all been waiting for..."
      title="The Nature of Monsters">

      {!currentUser && (
        <section>Loading...</section>
      )}

      {(Boolean(characterID) && !character) && (
        <section>Loading character...</section>
      )}

      {(Boolean(currentUser) && !character && !characterID) && (
        <CharacterSelect
          onSelect={id => setCharacterID(id)}
          ownerID={currentUser.uid} />
      )}

      {Boolean(character) && (
        <canvas
          height={height}
          ref={canvasElement}
          width={width} />
      )}
    </PageWrapper>
  )
}

Game.defaultProps = {
  currentUser: null,
}

Game.propTypes = {
  currentUser: PropTypes.object,
  firebaseApp: PropTypes.object.isRequired,
}





export default requireAuthentication(Game)
