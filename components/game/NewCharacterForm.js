// Module imports
import React, { useState } from 'react'
import PropTypes from 'prop-types'





const NewCharacterForm = ({ onSubmit }) => {
  const [color, setColor] = useState('#ffffff')
  const [name, setName] = useState('')

  const _onSubmit = event => {
    event.preventDefault()

    if (onSubmit) {
      onSubmit({
        color,
        name,
      })
    }
  }

  return (
    <form onSubmit={_onSubmit}>
      <fieldset>
        <label>Name</label>

        <input
          onChange={({ target: { value } }) => setName(value)}
          placeholder="e.g. Jon Snow"
          type="text"
          value={name} />
      </fieldset>

      <fieldset>
        <label>Color</label>

        <input
          onChange={({ target: { value } }) => setColor(value)}
          type="color"
          value={color} />
      </fieldset>

      <button
        className="primary"
        disabled={!name}
        type="submit">
        Start
      </button>
    </form>
  )
}

NewCharacterForm.defaultProps = {
  onSubmit: () => {},
}

NewCharacterForm.propTypes = {
  onSubmit: PropTypes.func,
}





export default NewCharacterForm
