// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'





// Local imports
import useDocumentEvent from 'effects/useDocumentEvent'
import useRouterEvent from 'effects/useRouterEvent'
import useWindowEvent from 'effects/useWindowEvent'





// Local constants
const INITIAL_STATE = {
	bannerIsOpen: true,
	bannerIsTogglable: false,
}
const RESIZE_BREAKPOINT = 1300
const RESIZE_DEBOUNCE_TIME = 500

const BannerContext = React.createContext({
	...INITIAL_STATE,
	closeBanner: () => {},
	openBanner: () => {},
	toggleBanner: () => {},
})






function BannerContextProvider(props) {
	const { children } = props
	const [bannerIsOpen, setBannerIsOpen] = useState(INITIAL_STATE.bannerIsOpen)
	const [bannerIsTogglable, setBannerIsTogglable] = useState(
		((typeof window !== 'undefined') ? window.innerWidth : (RESIZE_BREAKPOINT + 1)) <= RESIZE_BREAKPOINT
	)

	const closeBanner = useCallback(() => {
		document.querySelector('[role=banner] *:focus')?.blur()

		if (bannerIsOpen) {
			setBannerIsOpen(false)
		}
	}, [
		bannerIsOpen,
		setBannerIsOpen,
	])

	const openBanner = useCallback(() => {
		if (!bannerIsOpen) {
			setBannerIsOpen(true)
		}
	}, [
		bannerIsOpen,
		setBannerIsOpen,
	])

	const toggleBanner = useCallback(() => {
		if (bannerIsOpen) {
			closeBanner()
		} else {
			openBanner()
		}
	}, [
		bannerIsOpen,
		setBannerIsOpen,
	])

	const handleWindowResize = useCallback(debounce(() => {
		setBannerIsTogglable(window.innerWidth <= RESIZE_BREAKPOINT)
	}, RESIZE_DEBOUNCE_TIME), [
		setBannerIsTogglable,
	])

	useWindowEvent('resize', handleWindowResize, [handleWindowResize])

	useRouterEvent('routeChangeComplete', closeBanner, [closeBanner])
	useRouterEvent('routeChangeError', closeBanner, [closeBanner])

	useDocumentEvent('keyup', ({ key }) => {
		if (bannerIsOpen && (key.toLowerCase() === 'escape')) {
			closeBanner()
		}
	}, [
		bannerIsOpen,
		closeBanner,
	])

	useEffect(() => {
		if (!bannerIsTogglable) {
			openBanner()
		} else {
			closeBanner()
		}
	}, [bannerIsTogglable])

	return (
		<BannerContext.Provider
			value={{
				bannerIsOpen,
				bannerIsTogglable,
				closeBanner,
				openBanner,
				toggleBanner,
			}}>
			{children}
		</BannerContext.Provider>
	)
}

BannerContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useBanner = () => useContext(BannerContext)





export {
	BannerContext,
	BannerContextProvider,
	useBanner,
}
