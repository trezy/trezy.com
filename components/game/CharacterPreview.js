// Module imports
import React, {
  useEffect,
  useRef,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import getSprite from '../../helpers/getSprite'





// Local constants
const characterSpriteSize = 64





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterPreview = ({ character, mini }) => {
  if (typeof window === 'undefined') {
    return null
  }

  const canvasElement = useRef(null)

  useEffect(() => {
    const framesPerSecond = 30
    const totalFrames = 10
    const framesPerFrame = (60 / framesPerSecond)

    let currentFrame = 0
    let sprite = null
    let stop = false

    const renderLoop = () => {
      if (!stop) {
        if (canvasElement.current) {
          const context = canvasElement.current.getContext('2d')
          const sourceOffsetY = (character.gender === 'male') ? 0 : characterSpriteSize * 5

          let sourceOffsetX = 0

          if (currentFrame >= (totalFrames * framesPerFrame)) {
            currentFrame = 0
          } else if (Math.random() > 0.5) {
            currentFrame += 1
          }

          sourceOffsetX = characterSpriteSize * Math.floor((currentFrame / framesPerFrame) % 10)

          context.clearRect(0, 0, context.canvas.width, context.canvas.height)

          context.fillStyle = character.color
          context.fillRect(
            0,
            0,
            characterSpriteSize,
            characterSpriteSize,
          )

          context.drawImage(
            sprite.container,
            sourceOffsetX,
            sourceOffsetY,
            characterSpriteSize,
            characterSpriteSize,
            0,
            0,
            characterSpriteSize,
            characterSpriteSize,
          )
        }

        requestAnimationFrame(renderLoop)
      }
    }

    ;(async () => {
      sprite = await getSprite('characters', character.profession)

      renderLoop()
    })()

    return () => {
      stop = true
    }
  }, [character])

  return (
    <div className={classnames({
      'character-preview': true,
      mini,
    })}>
      <aside>
        <span>{character.name}</span>
      </aside>

      <canvas
        height={characterSpriteSize}
        ref={canvasElement}
        width={characterSpriteSize} />
    </div>
  )
}

CharacterPreview.defaultProps = {
  mini: false,
}

CharacterPreview.propTypes = {
  character: PropTypes.object.isRequired,
  mini: PropTypes.bool,
}
/* eslint-enable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */





export default CharacterPreview
