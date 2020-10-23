// Module imports
import React, {
	useEffect,
	useState,
} from 'react'
import {
	isEmpty,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import classnames from 'classnames'





// Local imports
import Nav from 'components/Nav'
import SocialNav from 'components/SocialNav'
import useAuthSelector from 'store/selectors/useAuthSelector'
import useClaimsSelector from 'store/selectors/useClaimsSelector'
import useCurrentUserSelector from 'store/selectors/useCurrentUserSelector'
import useDocumentEvent from 'effects/useDocumentEvent'
import useRouterEvent from 'effects/useRouterEvent'
import useWindowEvent from 'effects/useWindowEvent'





// Local constants
const RESIZE_BREAKPOINT = 1300
const RESIZE_DEBOUNCE_TIME = 500
const navItems = [
	{
		href: '/',
		icon: 'home',
		title: 'Home',
	},
	{
		href: '/blog',
		icon: 'book',
		title: 'Blog',
	},
	{
		href: '/about',
		icon: 'user',
		title: 'About',
	},
	{
		className: ({ isLive }) => classnames('stream-badge', {
			live: isLive,
		}),
		condition: ({ isLive }) => isLive,
		/* eslint-disable-next-line react/prop-types */
		iconComponent: () => (
			<span className="fa-layers fa-fw live-indicator">
				<FontAwesomeIcon
					aria-hidden
					icon="circle" />

				<FontAwesomeIcon
					aria-hidden
					icon={['far', 'circle']} />

				<FontAwesomeIcon
					aria-hidden
					icon={['far', 'circle']} />
			</span>
		),
		title: ({ isLive }) => {
			if (isLive) {
				return 'Trezy is live!'
			}

			return 'Trezy is offline'
		},
		href: 'https://twitch.tv/TrezyCodes',
	},

	// Only while logged out
	{
		href: ({ Router }) => `/login?destination=${Router.asPath}`,
		icon: 'sign-in-alt',
		title: 'Login',
		condition: ({ auth }) => isEmpty(auth),
	},

	// Only while logged in
	{
		icon: 'user-shield',
		title: 'Admin',
		condition: ({ auth, claims }) => !isEmpty(auth) && (claims['views.admin.blog'] || claims['views.admin.users']),
		subnav: [
			{
				href: '/admin/blog',
				icon: 'book',
				title: 'Blog',
				condition: ({ claims }) => claims['views.admin.blog'],
			},
			{
				href: '/admin/users',
				icon: 'users',
				title: 'Users',
				condition: ({ claims }) => claims['views.admin.users'],
			},
		],
	},
	{
		icon: 'tools',
		title: 'Tools',
		condition: ({ auth, claims }) => !isEmpty(auth) && claims['views.tools'],
		subnav: [
			{
				href: '/tools/movie-buddy',
				icon: 'film',
				title: 'Movie List',
			},
		],
	},
	{
		/* eslint-disable react/prop-types */
		iconComponent: ({ auth }) => {
			if (isEmpty(auth)) {
				return null
			}

			return (
				<img
					alt={`${auth.displayName}'s avatar`}
					className="avatar"
					role="presentation"
					src={auth.photoURL} />
			)
		},
		/* eslint-enable react/prop-types */
		label: 'My Account',
		title: ({ auth }) => {
			if (isEmpty(auth)) {
				return 'Loading user data...'
			}

			return auth.displayName
		},
		className: 'account-navigation',
		condition: ({ auth }) => !isEmpty(auth),
		subnav: [
			{
				href: '/dashboard/blog',
				icon: 'pen',
				title: 'Blog',
			},
			{
				href: ({ userProfile }) => {
					if (!userProfile) {
						return '/profile'
					}

					return `/profile/@${userProfile.username}`
				},
				icon: 'address-card',
				title: 'Profile',
			},
			{
				icon: 'sign-out-alt',
				title: 'Logout',
				condition: ({ auth }) => !isEmpty(auth),
				onClick: (event, {
					close,
					logout,
					Router,
				}) => {
					logout()
					close()
					Router.push('/login')
				},
			},
		],
	},
]





const Banner = () => {
	const firebase = useFirebase()
	const auth = useAuthSelector()
	const claims = useClaimsSelector()
	const isLive = useSelector(state => state.firebase.data?.['app-data']?.stream.online)
	const userProfile = useCurrentUserSelector()

	const [currentWidth, setCurrentWidth] = useState((typeof window === 'undefined') ? 0 : window.innerWidth)
	const [isOpen, setIsOpen] = useState(currentWidth <= RESIZE_BREAKPOINT)

	const close = () => {
		if (currentWidth <= RESIZE_BREAKPOINT) {
			const focusedElement = document.querySelector('[role=banner] *:focus')

			if (focusedElement) {
				focusedElement.blur()
			}

			setIsOpen(false)
		}
	}

	const updateOpenStateFromWindowSize = () => {
		if (isOpen) {
			close()
		} else if (!isOpen) {
			setIsOpen(true)
		}
	}

	const onToggle = () => setIsOpen(previousIsOpen => !previousIsOpen)

	useFirebaseConnect([
		{ path: 'app-data' },
	])

	useDocumentEvent('keyup', ({ key }) => {
		if (isOpen && (key.toLowerCase() === 'escape')) {
			close()
		}
	}, [isOpen])
	useRouterEvent('routeChangeComplete', updateOpenStateFromWindowSize)
	useRouterEvent('routeChangeError', updateOpenStateFromWindowSize)
	useEffect(updateOpenStateFromWindowSize, [currentWidth])

	useWindowEvent('resize', debounce(() => {
		if (window.innerWidth !== currentWidth) {
			setCurrentWidth(window.innerWidth)
		}
	}, RESIZE_DEBOUNCE_TIME))

	return (
		<>
			<header
				aria-expanded={isOpen}
				hidden={isOpen}
				role="banner">
				<h1 className="brand">&lt;trezy-who/&gt;</h1>

				<Nav
					auth={auth}
					claims={claims}
					close={close}
					isLive={isLive}
					isOpen={isOpen}
					items={navItems}
					logout={firebase.logout}
					onToggle={(currentWidth <= RESIZE_BREAKPOINT) ? onToggle : null}
					userProfile={userProfile} />

				<SocialNav isOpen={isOpen} />
			</header>
		</>
	)
}





export default Banner
