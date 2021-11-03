// Module imports
import { useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useRadioGroupContext } from 'components/RadioGroup/RadioGroup'





function RadioOption(props) {
	const {
		children,
		disabled,
		title,
		value,
	} = props
	const {
		baseID,
		currentValue,
		onChange,
	} = useRadioGroupContext()
	const isSelected = useMemo(() => (value === currentValue), [
		currentValue,
		value,
	])

	const id = `${baseID}:${value}`

	return (
		<li
			className={classnames({
				'radio-option': true,
				'is-selected': isSelected,
			})}>
			<label htmlFor={id}>
				<input
					checked={isSelected}
					disabled={disabled}
					id={id}
					onChange={onChange}
					type="radio"
					value={value} />

				<header>{title}</header>

				{Boolean(children) && (
					<p>{children}</p>
				)}
			</label>
		</li>
	)
}

RadioOption.defaultProps = {
	children: null,
	disabled: false,
}

RadioOption.propTypes = {
	children: PropTypes.node,
	disabled: PropTypes.bool,
	title: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
}

export { RadioOption }
