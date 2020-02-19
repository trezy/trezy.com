// Module imports
import PropTypes from 'prop-types'
import React from 'react'
import TextareaAutosize from 'react-autosize-textarea'





const Input = props => {
  const {
    multiline,
    type,
  } = props
  const passableProps = { ...props }

  delete passableProps.multiline
  delete passableProps.type

  return (
    <div className="input-container">
      {multiline && (
        <TextareaAutosize {...passableProps} />
      )}

      {!multiline && (
        <input
          {...passableProps}
          type={type} />
      )}
    </div>
  )
}

Input.defaultProps = {
  multiline: false,
  type: 'text',
}

Input.propTypes = {
  multiline: PropTypes.bool,
  type: PropTypes.string,
}





export default Input
