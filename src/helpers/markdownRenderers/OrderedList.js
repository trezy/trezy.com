// Module imports
import PropTypes from 'prop-types'





export function OrderedList(props) {
	const {
		children = null,
		start = 1,
	} = props

	return (
		<ol
			className={'numbered'}
			start={start}>
			{children}
		</ol>
	)
}

OrderedList.propTypes = {
	children: PropTypes.node,
	start: PropTypes.number,
}
