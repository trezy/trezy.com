// Module imports
import PropTypes from 'prop-types'





export function UnorderedList(props) {
	const { children } = props

	return (
		<ul className={'bulleted'}>
			{children}
		</ul>
	)
}

UnorderedList.defaultProps = {
	children: null,
	start: 1,
}

UnorderedList.propTypes = {
	children: PropTypes.node,
	start: PropTypes.number,
}
