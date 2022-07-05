// Module imports
import PropTypes from 'prop-types'





function Notice(props) {
	const { children } = props

	return (
		<div className={'notice'}>
			{children}
		</div>
	)
}

Notice.propTypes = {
	children: PropTypes.node.isRequired,
}

export { Notice }
