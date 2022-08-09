// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local constants
const HOVER_INTENT_TIMEOUT = 2000

const NavContext = createContext({
	openSubNav: null,
	toggleSubNav: () => {},
})





function Nav(props) {
	const {
		children,
		className,
		isOpen,
	} = props
	const timeoutID = useRef(null)
	const [openSubNav, setOpenSubNav] = useState(null)

	const handleTimeout = useCallback(() => {
		setOpenSubNav(null)
	}, [setOpenSubNav])

	const handleEnterIntent = useCallback(() => {
		timeoutID.current = setTimeout(handleTimeout, HOVER_INTENT_TIMEOUT)
	}, [handleTimeout])

	const handleLeaveIntent = useCallback(() => {
		if (timeoutID.current) {
			clearTimeout(timeoutID.current)
			timeoutID.current = null
		}
	}, [])

	const toggleSubNav = useCallback(subNavID => {
		setOpenSubNav(previousState => {
			if (previousState === subNavID) {
				return null
			}

			return subNavID
		})
	}, [setOpenSubNav])

	return (
		<NavContext.Provider
			value={{
				isOpen,
				openSubNav,
				toggleSubNav,
			}}>
			{/*
				We're specifically not adding key events to the main nav because a
				keyboard user won't expect the nav to suddenly close without their
				direct interaction.
			*/}
			{/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
			<nav
				className={className}
				onMouseOver={handleLeaveIntent}
				onMouseOut={handleEnterIntent}>
				{children}
			</nav>
		</NavContext.Provider>
	)
}

Nav.defaultProps = {
	className: '',
}

Nav.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	isOpen: PropTypes.bool.isRequired,
}

const useNav = () => useContext(NavContext)

export {
	Nav,
	useNav,
}
