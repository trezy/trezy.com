// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
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

export const BannerContext = createContext({
	...INITIAL_STATE,
	closeBanner: () => {},
	openBanner: () => {},
	toggleBanner: () => {},
})






export function BannerContextProvider(props) {
	const { children } = props
	const [bannerIsOpen, setBannerIsOpen] = useState(INITIAL_STATE.bannerIsOpen)
	const [bannerIsTogglable, setBannerIsTogglable] = useState(
		((typeof window !== 'undefined') ? window.innerWidth : (RESIZE_BREAKPOINT + 1)) <= RESIZE_BREAKPOINT
	)

	const closeBanner = useCallback(() => {
		document.querySelector('[role=banner] *:focus')?.blur()

		if (bannerIsTogglable && bannerIsOpen) {
			setBannerIsOpen(false)
		}
	}, [
		bannerIsOpen,
		bannerIsTogglable,
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
	}, RESIZE_DEBOUNCE_TIME), [setBannerIsTogglable])

	const handleEscapeKey = useCallback(({ key }) => {
		if (bannerIsOpen && (key.toLowerCase() === 'escape')) {
			closeBanner()
		}
	}, [
		bannerIsOpen,
		closeBanner,
	])

	useWindowEvent('resize', handleWindowResize, [handleWindowResize])

	useRouterEvent('routeChangeComplete', closeBanner, [closeBanner])
	useRouterEvent('routeChangeError', closeBanner, [closeBanner])

	useDocumentEvent('keyup', handleEscapeKey, [])

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

export const useBanner = () => useContext(BannerContext)
