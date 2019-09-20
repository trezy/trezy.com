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
import LocalForage from 'localforage'
import uuid from 'uuid/v4'





// Local imports
import { actions } from '../store'
import { firebaseApp } from '../helpers/firebase'
import NewCharacterForm from '../components/NewCharacterForm'
import PageWrapper from '../components/PageWrapper'





// Local constants
const characterSizes = {
  small: 50,
  medium: 100,
  large: 200,
}





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const Game = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const [characterID, setCharacterID] = useState(null)
  const [newCharacterData, setNewCharacterData] = useState(null)
  const [isLoadingCharacterID, setIsLoadingCharacterID] = useState(true)
  const [isGeneratingCharacterData, setIsGeneratingCharacterData] = useState(false)

  const canvasElement = useRef(null)
  const dispatch = useDispatch()
  const keysPressed = {}
  const store = useStore()
  const [{ height, width }, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  const database = firebaseApp.database()
  const characterCollection = database.ref('game/characters')

  useEffect(() => {
    (async () => {
      if (!isGeneratingCharacterData) {
        setIsLoadingCharacterID(true)

        const id = await LocalForage.getItem('gameCharacterID')

        if (id) {
          setCharacterID(id)
        }

        setTimeout(() => setIsLoadingCharacterID(false), 500)
      }
    })()
  }, [isGeneratingCharacterData])

  useEffect(() => {
    (async () => {
      if (newCharacterData && !characterID) {
        setIsGeneratingCharacterData(true)

        const id = uuid()

        LocalForage.setItem('gameCharacterID', id)

        await database.ref(`game/characters/${id}`).set({
          ...newCharacterData,
          id,
          size: 'medium',
          x: 0,
          y: 0,
        })

        setTimeout(() => setIsGeneratingCharacterData(false), 500)
      }
    })()
  }, [characterID, newCharacterData])

  useEffect(() => {
    if (!isGeneratingCharacterData && characterID) {
      const myCharacterRef = database.ref(`game/characters/${characterID}`)

      characterCollection.on('value', snapshot => {
        const value = snapshot.val()

        dispatch(actions.updateCharacters(value))
      })

      const drawCharacter = (context, character) => {
        context.fillStyle = character.color
        context.fillRect(
          Math.floor(character.x),
          Math.floor(character.y),
          Math.floor(characterSizes[character.size]),
          Math.floor(characterSizes[character.size]),
        )
      }

      window.addEventListener('resize', () => {
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
        })
      })

      window.addEventListener('keydown', ({ key }) => {
        keysPressed[key] = true
      })

      window.addEventListener('keyup', ({ key }) => delete keysPressed[key])

      const gameLoop = () => {
        if (canvasElement.current) {
          const {
            game: { characters },
          } = store.getState()
          const myCharacter = characters[characterID]

          if (myCharacter) {
            const context = canvasElement.current.getContext('2d')

            context.clearRect(0, 0, context.canvas.width, context.canvas.height)

            Object.values(characters).forEach(character => {
              drawCharacter(context, character)
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
  }, [characterID, isGeneratingCharacterData, isLoadingCharacterID])

  return (
    <PageWrapper
      description="The MMOment you've all been waiting for..."
      title="Exanimus">
      {isLoadingCharacterID && (
        <section>Loading character ID...</section>
      )}

      {(!isLoadingCharacterID && isGeneratingCharacterData) && (
        <section>Generating character data...</section>
      )}

      {(!isLoadingCharacterID && !isGeneratingCharacterData && !characterID) && (
        <section>
          <NewCharacterForm onSubmit={data => setNewCharacterData(data)} />
        </section>
      )}

      {(!isLoadingCharacterID && !isGeneratingCharacterData && characterID) && (
        <canvas
          height={height}
          ref={canvasElement}
          width={width} />
      )}
    </PageWrapper>
  )
}





export default Game
