// Module imports
import React, {
  forwardRef,
} from 'react'
import marked from 'marked'
import PropTypes from 'prop-types'





// Local imports
import Input from './Input'





const MarkdownEditor = forwardRef((props, ref) => {
  const {
    disabled,
    multiline,
    onChange,
    placeholder,
    previewMode,
    value,
  } = props

  return (
    <>
      <Input
        disabled={disabled}
        hidden={previewMode}
        multiline={multiline}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        value={value} />

      {previewMode && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: marked(value) }} />
        </>
      )}
    </>
  )
})

MarkdownEditor.defaultProps = {
  disabled: false,
  multiline: true,
  placeholder: '',
  previewMode: false,
}

MarkdownEditor.propTypes = {
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  previewMode: PropTypes.bool,
  value: PropTypes.string.isRequired,
}





export default MarkdownEditor
