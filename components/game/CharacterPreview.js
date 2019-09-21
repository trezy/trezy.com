// Module imports
import React, {
  useEffect,
  useRef,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local constants
const characterSizes = {
  small: 50,
  medium: 100,
  large: 200,
}





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterPreview = ({ character, mini }) => {
  if (typeof window === 'undefined') {
    return null
  }

  const canvasElement = useRef(null)
  const characterSize = characterSizes[character.size]
  // const previewSize = mini ? (characterSize / 2) : characterSize
  const previewSize = characterSize

  useEffect(() => {
    let stop = false

    const renderLoop = () => {
      if (!stop) {
        if (canvasElement.current) {
          const context = canvasElement.current.getContext('2d')

          context.clearRect(0, 0, context.canvas.width, context.canvas.height)

          context.fillStyle = character.color
          context.fillRect(
            0,
            0,
            previewSize,
            previewSize,
          )
        }

        requestAnimationFrame(renderLoop)
      }
    }

    renderLoop()

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
        height={previewSize}
        ref={canvasElement}
        width={previewSize} />
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
