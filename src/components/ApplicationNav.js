// Module imports
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
				icon="home"
				title="Home" />

			<NavLink
				href="/blog"
				icon="book"
				title="Blog" />

			<NavLink
				href="/about"
				icon="user"
				title="About" />

			{!user && (
				<NavLink
					href={`/login?destination=${router.asPath}`}
					icon="sign-in-alt"
					title="Login" />
			)}

			{(user && (claims?.['views.admin.blog'] || claims?.['views.admin.users'])) && (
				<SubNav
					icon="user-shield"
					title="Admin">
					{claims['views.admin.blog'] && (
						<NavLink
							href="/admin/blog"
							icon="book"
							title="Blog" />
					)}

					{claims['views.admin.users'] && (
						<NavLink
							href="/admin/users"
							icon="users"
							title="Users" />
					)}
				</SubNav>
			)}

			{(user && (claims?.['views.tools'])) && (
				<SubNav
					icon="tools"
					title="Tools">
					<NavLink
						href="/tools/movie-buddy"
						icon="film"
						title="Movie List" />
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
						icon="sliders-h"
						title="Settings" />
					<NavLink
						href="/dashboard/blog"
						icon="sign-out-alt"
						onClick={handleLogout}
						title="Logout" />
				</SubNav>
			)}
		</Nav>
	)
}

export { ApplicationNav }
