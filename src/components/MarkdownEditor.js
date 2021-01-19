// Module imports
import React, {
	forwardRef,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import Input from 'components/Input'
import MarkdownRenderer from 'components/MarkdownRenderer'





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
			{!previewMode && (
				<Input
					className="markdown-editor"
					disabled={disabled}
					hidden={previewMode}
					multiline={multiline}
					onChange={onChange}
					placeholder={placeholder}
					ref={ref}
					value={value} />
			)}

			{previewMode && (
				<MarkdownRenderer children={value} />
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
