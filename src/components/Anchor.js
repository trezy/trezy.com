// Module imports
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
// import { useAckee } from 'hooks/useAckee.js'





function Anchor(props) {
	const router = useRouter()
	const {
		className = '',
		children,
		href,
		tracking = null,
		trackingID = null,
	} = props
	// const { trackAction } = useAckee()

	const handleClick = useCallback(event => {
		event.preventDefault()

		if (trackingID && tracking) {
			// trackAction(trackingID, tracking)
		}

		router.push(href)
	}, [
		// trackAction,
		tracking,
		trackingID,
	])

	return (
		<a
			className={classnames(className)}
			href={href}
			onClick={handleClick}>
			{children}
		</a>
	)
}

Anchor.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	href: PropTypes.string.isRequired,
	tracking: PropTypes.object,
	trackingID: PropTypes.string,
}

export { Anchor }
