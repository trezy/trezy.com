// Module imports
import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-autosize-textarea'





const Input = forwardRef((props, ref) => {
	const {
		multiline = false,
		prefix = '',
		type = 'text',
	} = props
	const passableProps = {
		...props,
		ref,
	}

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
})

Input.propTypes = {
	multiline: PropTypes.bool,
	prefix: PropTypes.string,
	type: PropTypes.string,
}





export default Input
