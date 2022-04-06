// Module imports
import {
	faBook,
	faHome,
	faSignInAlt,
	faSignOutAlt,
	faSlidersH,
	faUser,
	faUsers,
	faUserShield,
} from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'
import { useRouter } from 'next/router'





// Local imports
import {
	Nav,
	NavLink,
	SubNav,
} from 'components/Nav'
import { useAuth } from 'contexts/AuthContext'
import { useBanner } from 'contexts/BannerContext'
import getAvatar from 'helpers/getAvatar'





function ApplicationNav() {
	const {
		claims,
		logout,
		profile,
		user,
	} = useAuth()
	const {
		bannerIsOpen,
		closeBanner,
	} = useBanner()
	const router = useRouter()

	const handleLogout = useCallback(() => {
		logout()
		closeBanner()
		router.push('/login')
	}, [
		closeBanner,
		logout,
		router,
	])

	return (
		<Nav isOpen={bannerIsOpen}>
			<NavLink
				href="/"
				icon={faHome}
				title="Home" />

			<NavLink
				href="/blog"
				icon={faBook}
				title="Blog" />

			<NavLink
				href="/about"
				icon={faUser}
				title="About" />

			{!user && (
				<NavLink
					href={`/login?destination=${router.asPath}`}
					icon={faSignInAlt}
					title="Login" />
			)}

			{(user && (claims?.['views.admin.blog'] || claims?.['views.admin.users'])) && (
				<SubNav
					icon={faUserShield}
					title="Admin">
					{claims['views.admin.blog'] && (
						<NavLink
							href="/admin/blog"
							icon={faBook}
							title="Blog" />
					)}

					{claims['views.admin.users'] && (
						<NavLink
							href="/admin/users"
							icon={faUsers}
							title="Users" />
					)}
				</SubNav>
			)}

			{Boolean(user) && (
				<SubNav
					className="account-navigation"
					icon={() => {
						if (!profile) {
							return null
						}

						return (
							<img
								alt={`${profile.displayName}'s avatar`}
								className="avatar"
								role="presentation"
								src={getAvatar(profile)} />
						)
					}}
					label="My Account"
					title={!profile ? 'Loading profile data...' : user.displayName}>
					<NavLink
						href="/settings"
						icon={faSlidersH}
						title="Settings" />
					<NavLink
						href="/dashboard/blog"
						icon={faSignOutAlt}
						onClick={handleLogout}
						title="Logout" />
				</SubNav>
			)}
		</Nav>
	)
}

export { ApplicationNav }
