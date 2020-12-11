// Module imports
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useFirebase } from 'hooks/useFirebase'





function Anchor(props) {
	const router = useRouter()
	const {
		className,
		children,
		href,
		tracking,
	} = props
	const {
		analytics,
		auth,
		firestore,
	} = useFirebase()

	const handleClick = useCallback(event => {
		event.preventDefault()

		if (tracking) {
			analytics.logEvent(...tracking)
		}

		router.push(href)
	}, [])

	return (
		<a
			className={classnames(className)}
			href={href}
			onClick={handleClick}>
			{children}
		</a>
	)
}

Anchor.defaultProps = {
	className: '',
	tracking: null,
}

Anchor.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	href: PropTypes.string.isRequired,
	tracking: PropTypes.array,
}

export { Anchor }
