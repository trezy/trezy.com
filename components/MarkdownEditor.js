// Module imports
import React, {
  forwardRef,
  useState,
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
  const [body, setBody] = useState(value || '')

  const _onChange = ({ target }) => {
    if (onChange) {
      onChange(target.value)
    } else {
      setBody(target.value)
    }
  }

  return (
    <div>
      <TextareaAutosize
        disabled={disabled}
        hidden={previewMode}
        onChange={_onChange}
        placeholder={placeholder}
        ref={ref}
        value={value || body} />

      {previewMode && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: marked(value || body) }} />
        </>
      )}
    </div>
  )
})

MarkdownEditor.defaultProps = {
  disabled: false,
  onChange: null,
  placeholder: '',
  previewMode: false,
  value: '',
}

MarkdownEditor.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  previewMode: PropTypes.bool,
  value: PropTypes.string,
}





export default MarkdownEditor
