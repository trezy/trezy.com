// Module imports
import React, {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import classnames from 'classnames'





// Local imports
import { ApplicationNav } from 'components/ApplicationNav'
import { BannerToggle } from 'components/Banner/BannerToggle'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { NavLink } from 'components/Nav'
import { SocialNav } from 'components/SocialNav'
import { useAuth } from 'contexts/AuthContext'
import useDocumentEvent from 'effects/useDocumentEvent'
import useRouterEvent from 'effects/useRouterEvent'
import useWindowEvent from 'effects/useWindowEvent'





// Local constants
const RESIZE_BREAKPOINT = 1300
const RESIZE_DEBOUNCE_TIME = 500





const Banner = () => {
	const router = useRouter()
	const { user } = useAuth()

	const [isOpen, setIsOpen] = useState(true)
	const [isTogglable, setIsTogglable] = useState(((typeof window !== 'undefined') ? window.innerWidth : (RESIZE_BREAKPOINT + 1)) <= RESIZE_BREAKPOINT)

	const close = useCallback(() => {
		if (isTogglable) {
			document.querySelector('[role=banner] *:focus')?.blur()
			setIsOpen(false)
		}
	}, [
		isTogglable,
		setIsOpen,
	])

	const handleToggle = () => setIsOpen(previousIsOpen => !previousIsOpen)

	useDocumentEvent('keyup', ({ key }) => {
		if (isOpen && (key.toLowerCase() === 'escape')) {
			close()
		}
	}, [isOpen])

	useRouterEvent('routeChangeComplete', close, [close])
	useRouterEvent('routeChangeError', close, [close])

	useWindowEvent('resize', debounce(() => {
		setIsTogglable(window.innerWidth <= RESIZE_BREAKPOINT)
	}, RESIZE_DEBOUNCE_TIME), [
		setIsOpen,
		setIsTogglable,
	])

	useEffect(() => {
		setIsOpen(!isTogglable)
	}, [
		isTogglable,
		setIsOpen,
	])

	return (
		<header
			aria-expanded={isOpen}
			hidden={isOpen}
			role="banner">
			<h1 className="brand">&lt;trezy-who/&gt;</h1>

			{isTogglable && (
				<BannerToggle
					isOpen={isOpen}
					onClick={handleToggle} />
			)}

			<ApplicationNav
				close={close}
				isOpen={isOpen} />

			<SocialNav isOpen={isOpen} />
		</header>
	)
}





export default Banner
