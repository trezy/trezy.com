// Module imports
import PropTypes from 'prop-types'





export function UnorderedList(props) {
	const { children = null, start = 1 } = props

	return (
		<ul className={'bulleted'}>
			{children}
		</ul>
	)
}

UnorderedList.propTypes = {
	children: PropTypes.node,
	start: PropTypes.number,
}
