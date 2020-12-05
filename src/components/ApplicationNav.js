// Module imports
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Local imports
import {
	Nav,
	NavLink,
	SubNav,
} from 'components/Nav'
import { useAuth } from 'contexts/AuthContext'
import getAvatar from 'helpers/getAvatar'





function ApplicationNav(props) {
	const { isOpen } = props
	const {
		claims,
		close,
		logout,
		user,
	} = useAuth()
	const router = useRouter()

	const handleLogout = useCallback(() => {
		logout()
		close()
		router.push('/login')
	}, [
		close,
		logout,
		router,
	])

	return (
		<Nav isOpen={isOpen}>
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
						if (!user) {
							return null
						}

						return (
							<img
								alt={`${user.displayName}'s avatar`}
								className="avatar"
								role="presentation"
								src={getAvatar(user)} />
						)
					}}
					label="My Account"
					title={!user ? 'Loading user data...' : user.displayName}>
					<NavLink
						href="/dashboard/blog"
						icon="pen"
						title="My Articles" />
					<NavLink
						href={!user ? '/profile' : `/profile/@${user.username}`}
						icon="address-card"
						title="My Profile" />
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

ApplicationNav.defaultProps = {
	isOpen: true,
}

ApplicationNav.propTypes = {
	isOpen: PropTypes.bool.isRequired,
}

export { ApplicationNav }
