// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import { debounce } from 'lodash'
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
  firebase,
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

  const database = firebaseApp.database()
  const firestore = firebaseApp.firestore()

  const characterCollection = firestore.collection('characters')
  const characterRTCollection = database.ref('game/characters')

  useEffect(() => {
    if (!characterID) {
      Router.push('/game/character-select')
    }
  }, [])

  useEffect(() => {
    let unsubscribe = () => {}

    if (characterID && !character) {
      unsubscribe = characterCollection.doc(characterID).onSnapshot(characterDoc => {
        character = {
          id: characterID,
          ...(character || {}),
          ...characterDoc.data(),
        }

        setIsCharacterLoaded(true)
      })
    }

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribes = []

    if (character) {
      unsubscribes.push(database.ref('.info/connected').on('value', snapshot => {
        if (snapshot.val() === false) {
          return
        }

        const characterStatusRef = database.ref(`game/characters/${characterID}`)

        characterStatusRef.onDisconnect().update({
          active: 'offline',
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        }).then(() => {
          characterStatusRef.update({
            active: 'online',
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
          })
        })
      }))

      unsubscribes.push(characterCollection.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const characterDoc = change.doc
          const characterData = characterDoc.data()
          const originalCharacterData = characters[characterDoc.id]

          /* eslint-disable-next-line default-case */
          switch (change.type) {
            case 'added':
              characters[characterDoc.id] = {
                ...characterData,
                currentFrame: 0,
                id: characterDoc.id,
                isMoving: false,
                sprite: null,
                previousX: characterData.x,
                previousY: characterData.y,
              }
              break

            case 'modified':
              characters[characterDoc.id] = {
                ...originalCharacterData,
                ...characterData,
              }
              break

            case 'removed':
              delete characters[characterDoc.id]
              break
          }
        })
      }))

      unsubscribes.push(characterRTCollection.on('child_changed', characterDoc => {
        const characterData = characterDoc.val()
        const originalCharacterData = characters[characterDoc.key]

        characters[characterDoc.key] = {
          ...characters[characterDoc.key],
          direction: characterData.direction,
          isMoving: (originalCharacterData.x !== characterData.x) || (originalCharacterData.y !== characterData.y),
          previousX: originalCharacterData.x,
          previousY: originalCharacterData.y,
          x: characterData.x,
          y: characterData.y,
        }
      }))
    }

    return () => unsubscribes.forEach(unsubscribe => unsubscribe())
  }, [character])

  useEffect(() => {
    const characterSpriteSize = 64
    const framesPerSecond = 20
    const totalFrames = 10
    const framesPerFrame = 60 / framesPerSecond
    const moveSpeed = 5
    const stopMoving = debounce(characterData => {
      characterData.isMoving = false
    })

    const drawCharacter = (context, characterData) => {
      if (!characterData.sprite) {
        characterData.sprite = getSprite('characters', characterData.profession).then(sprite => {
          characterData.sprite = sprite
        }).catch(error => {
          console.log(error)
        })
      } else if (!(characterData.sprite instanceof Promise)) {
        let sourceOffsetY = (characterData.gender === 'male') ? 0 : characterSpriteSize * 5

        if (characterData.isMoving) {
          sourceOffsetY += characterSpriteSize * 2

          if ((characterData.previousX === characterData.x) && (characterData.previousY === characterData.y)) {
            stopMoving(characterData)
          }
          characterData.previousX = characterData.x
          characterData.previousY = characterData.y
        }

        let sourceOffsetX = characterSpriteSize * Math.floor((characterData.currentFrame / framesPerFrame) % 10)

        if (characterData.direction === 'left') {
          sourceOffsetX += 640
        }

        if (characterData.currentFrame >= (totalFrames * framesPerFrame)) {
          characterData.currentFrame = 0
        } else if (Math.random() > 0.5) {
          characterData.currentFrame += 1
        }

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

            Object.values(characters).forEach(characterData => drawCharacter(context, characterData))

            let newX = myCharacter.x
            let newY = myCharacter.y

            if (keysPressed.w) {
              newY -= moveSpeed
            }

            if (keysPressed.s) {
              newY += moveSpeed
            }

            if (keysPressed.a) {
              newX -= moveSpeed
            }

            if (keysPressed.d) {
              newX += moveSpeed
            }

            if ((newY !== myCharacter.y) || (newX !== myCharacter.x)) {
              database.ref(`game/characters/${characterID}`).update({
                direction: (newX > myCharacter.x) ? 'right' : 'left',
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
  firebase: PropTypes.object.isRequired,
  firebaseApp: PropTypes.object.isRequired,
}





export default requireAuthentication(Game)
