// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import Link from 'next/link'





// Component imports
import { Code } from 'components/Code'
import { useAuth } from 'contexts/AuthContext'
import { useRoles } from 'contexts/RolesContext'
import Button from 'components/Button'
import getAvatar from 'helpers/getAvatar'
import Image from 'components/Image'





export function UserAdmin() {
	const {
		refreshUser,
		user,
	} = useAuth()
	const {
		isLoaded: rolesIsLoaded,
		roles,
	} = useRoles()
	const [isLoaded, setIsLoaded] = useState(false)
	const [users, setUsers] = useState([])

	const addRole = useCallback(async event => {
		const { target } = event

		const roleID = target.getAttribute('data-role-id')
		const userID = target.getAttribute('data-user-id')

		const { ok } = await fetch('/api/users/update-permissions', {
			body: JSON.stringify({
				roleID,
				userID,
			}),
			headers: { 'Content-Type': 'application/json' },
			method: 'post',
		})

		if (ok && (userID === user.id)) {
			refreshUser()
		}
	}, [user])

	const getUsers = useCallback(async () => {
		const response = await fetch('/api/users')
		const { users } = await response.json()
		setUsers(users)
		setIsLoaded(true)
	}, [
		setIsLoaded,
		setUsers,
	])

	const mapUser = useCallback(user => {
		const {
			auth,
			profile,
			settings,
		} = user

		return (
			<li
				className="block no-pad"
				key={auth.uid}>
				<Image
					alt={`${profile.displayName}'s avatar`}
					src={getAvatar(profile)} />

				<div className="details">
					<header>
						<h3>{profile.displayName}</h3>
					</header>

					<dl>
						<dt>ID</dt>
						<dd>{auth.uid}</dd>

						{Boolean(auth.email) && (
							<>
								<dt>Email</dt>
								<dd>
									<a href={`mailto:${auth.email}`}>
										{auth.email}
									</a>
								</dd>
							</>
						)}

						<dt>Member Since</dt>
						<dd>{auth.metadata.creationTime}</dd>

						<dt>Last Login</dt>
						<dd>{auth.metadata.lastSignInTime}</dd>

						<dt>Verified</dt>
						<dd>{auth.emailVerified ? 'Yes' : 'No'}</dd>

						<dt>Profile Visibility</dt>
						<dd>{profile.visibility}</dd>
					</dl>

					<header><h4>Linked Accounts</h4></header>

					<ul className="bulleted">
						{auth.providerData.map(providerData => {
							const { providerId } = providerData

							const providerName = {
								'google.com': 'Google',
								'twitter.com': 'Twitter',
							}[providerId]

							return (
								<li id={providerData.uid}>
									{providerName || providerId}
								</li>
							)
						})}
					</ul>

					<header><h4>Raw User Data</h4></header>

					<details>
						<header><h5>Auth</h5></header>
						<Code
							language="json"
							value={JSON.stringify(auth, null, 2)} />

						<header><h5>Profile</h5></header>
						<Code
							language="json"
							value={JSON.stringify(profile, null, 2)} />

						<header><h5>Settings</h5></header>
						<Code
							language="json"
							value={JSON.stringify(settings, null, 2)} />
					</details>
				</div>

				<menu
					className="actions"
					type="toolbar">
					{Object.entries(roles).map(([roleID, role]) => (
						<Button
							data-user-id={profile.id}
							data-role-id={roleID}
							key={roleID}
							onClick={addRole}>
							Add "{role.displayName}" Role
						</Button>
					))}
				</menu>
			</li>
		)
	}, [])

	useEffect(() => getUsers(), [getUsers])

	return (
		<section>
			{!isLoaded && 'Loading...'}

			{isLoaded && (
				<ul className="users-list">
					{users.map(mapUser)}
				</ul>
			)}
		</section>
	)
}
