// Module imports
import { useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





function Tab(props) {
	const {
		isActive,
		name,
		onClick,
	} = props

	const handleClick = useCallback(event => {
		onClick(name)
	}, [
		name,
		onClick,
	])

	return (
		<button
			className={classnames({
				'is-active': isActive,
				tab: true,
			})}
			onClick={handleClick}
			type="button">
			{name}
		</button>
	)
}

Tab.propTypes = {
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
}

export { Tab }
