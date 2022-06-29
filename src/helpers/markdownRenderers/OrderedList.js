// Module imports
import PropTypes from 'prop-types'





export function OrderedList(props) {
	const {
		children,
		start,
	} = props

	return (
		<ol
			className={'numbered'}
			start={start}>
			{children}
		</ol>
	)
}

OrderedList.defaultProps = {
	children: null,
	start: 1,
}

OrderedList.propTypes = {
	children: PropTypes.node,
	ordered: PropTypes.bool.isRequired,
	start: PropTypes.number,
}
