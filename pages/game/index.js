// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Local imports
import PageWrapper from '../../components/PageWrapper'
import requireAuthentication from '../../components/requireAuthentication'





// Local constants
const characters = {}





// Local variables
let character = null





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const Game = ({
  characterID,
  // currentUser,
  firebaseApp,
}) => {
  if (typeof window === 'undefined') {
    return null
  }

  const canvasElement = useRef(null)
  const keysPressed = {}
  const [isCharacterLoaded, setIsCharacterLoaded] = useState(false)
  const [{ height, width }, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  // const database = firebaseApp.database()
  const firestore = firebaseApp.firestore()

  const characterCollection = firestore.collection('characters')

  useEffect(() => {
    if (!characterID) {
      Router.push('/game/character-select')
    }
  }, [])

  /* eslint-disable-next-line consistent-return */
  useEffect(() => {
    if (characterID && !character) {
      return characterCollection.doc(characterID).onSnapshot(characterDoc => {
        character = {
          id: characterID,
          ...(character || {}),
          ...characterDoc.data(),
        }

        setIsCharacterLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    let unsubscribe = () => {}

    if (character) {
      unsubscribe = characterCollection.onSnapshot(snapshot => {
        snapshot.forEach(characterDoc => {
          characters[characterDoc.id] = {
            id: characterDoc.id,
            ...(characters[characterDoc.id] || {}),
            ...characterDoc.data(),
          }
        })
      })
    }

    return unsubscribe
  }, [character])

  useEffect(() => {
    const drawCharacter = (context, characterData) => {
      context.fillStyle = characterData.color
      context.lineWidth = 4
      context.strokeStyle = 'black'

      context.fillRect(
        Math.floor(characterData.x),
        Math.floor(characterData.y),
        100,
        100,
      )
      context.strokeRect(
        Math.floor(characterData.x),
        Math.floor(characterData.y),
        100,
        100,
      )

      context.font = '1em serif'
      context.fillStyle = 'black'
      context.fillText(
        characterData.name,
        Math.floor(characterData.x),
        Math.floor(characterData.y - 5),
      )
    }

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

    if (isCharacterLoaded) {
      window.addEventListener('resize', handleResizeEvent)
      window.addEventListener('keydown', handleKeydownEvent)
      window.addEventListener('keyup', handleKeyupEvent)

      const gameLoop = () => {
        if (canvasElement.current) {
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
              characterCollection.doc(characterID).update({
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
  }, [isCharacterLoaded])

  return (
    <PageWrapper
      description="The MMOment you've all been waiting for..."
      title="A Monster's Nature">
      {!characterID && (
        <section>No character selected; returning to character selection...</section>
      )}

      {characterID && !isCharacterLoaded && (
        <section>Loading character...</section>
      )}

      {isCharacterLoaded && (
        <canvas
          height={height}
          ref={canvasElement}
          width={width} />
      )}
    </PageWrapper>
  )
}

Game.getInitialProps = ({ query }, setLayoutProps) => {
  setLayoutProps({ renderLayout: false })

  return { characterID: query.characterID }
}

Game.defaultProps = {
  characterID: null,
  // currentUser: null,
}

Game.propTypes = {
  characterID: PropTypes.string,
  // currentUser: PropTypes.object,
  firebaseApp: PropTypes.object.isRequired,
}





export default requireAuthentication(Game)
