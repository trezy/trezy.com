// Module imports
import PropTypes from 'prop-types'
import React from 'react'
import TextareaAutosize from 'react-autosize-textarea'





const Input = props => {
  const {
    multiline,
    prefix,
    type,
  } = props
  const passableProps = { ...props }

  delete passableProps.multiline
  delete passableProps.prefix
  delete passableProps.type

  return (
    <div className="input-container">
      <span className="prefix">
        {prefix}
      </span>

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
  prefix: '',
  type: 'text',
}

Input.propTypes = {
  multiline: PropTypes.bool,
  prefix: PropTypes.string,
  type: PropTypes.string,
}





export default Input
