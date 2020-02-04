// Module imports
import React, {
  forwardRef,
} from 'react'
import marked from 'marked'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-autosize-textarea'





const MarkdownEditor = forwardRef((props, ref) => {
  const {
    disabled,
    onChange,
    placeholder,
    previewMode,
    value,
  } = props

  return (
    <>
      <TextareaAutosize
        disabled={disabled}
        hidden={previewMode}
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
  placeholder: '',
  previewMode: false,
}

MarkdownEditor.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  previewMode: PropTypes.bool,
  value: PropTypes.string.isRequired,
}





export default MarkdownEditor
