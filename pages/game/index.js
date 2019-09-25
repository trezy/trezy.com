// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Local imports
import getSprite from '../../helpers/getSprite'
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
        snapshot.docChanges().forEach(change => {
          const characterDoc = change.doc

          /* eslint-disable-next-line default-case */
          switch (change.type) {
            case 'added':
              characters[characterDoc.id] = {
                id: characterDoc.id,
                ...characterDoc.data(),
                currentFrame: 0,
                sprite: null,
              }
              break

            case 'modified':
              characters[characterDoc.id] = {
                ...characters[characterDoc.id],
                ...characterDoc.data(),
              }
              break

            case 'removed':
              delete characters[characterDoc.id]
              break
          }
        })
      })
    }

    return unsubscribe
  }, [character])

  useEffect(() => {
    const characterSpriteSize = 64
    const framesPerSecond = 30
    const totalFrames = 10
    const framesPerFrame = 60 / framesPerSecond

    const drawCharacter = (context, characterData) => {
      if (!characterData.sprite) {
        characterData.sprite = getSprite('characters', characterData.profession).then(sprite => {
          characterData.sprite = sprite
        }).catch(error => {
          console.log(error)
        })
      } else if (!(characterData.sprite instanceof Promise)) {
        const sourceOffsetY = (characterData.gender === 'male') ? 0 : characterSpriteSize * 5

        let sourceOffsetX = 0

        if (characterData.currentFrame >= (totalFrames * framesPerFrame)) {
          characterData.currentFrame = 0
        } else if (Math.random() > 0.5) {
          characterData.currentFrame += 1
        }

        sourceOffsetX = characterSpriteSize * Math.floor((characterData.currentFrame / framesPerFrame) % 10)

        context.font = '1em serif'
        context.fillStyle = 'black'
        context.fillText(
          characterData.name.substring(0, 20),
          Math.floor(characterData.x),
          Math.floor(characterData.y - 5),
        )
        context.drawImage(
          characterData.sprite.container,
          sourceOffsetX,
          sourceOffsetY,
          characterSpriteSize,
          characterSpriteSize,
          Math.floor(characterData.x),
          Math.floor(characterData.y),
          characterSpriteSize,
          characterSpriteSize,
        )
      }
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
