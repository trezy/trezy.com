// Module imports
import { useCallback } from 'react'
import Link from 'next/link'





// Component imports
import { useAuth } from 'contexts/AuthContext'
import { useProfiles } from 'contexts/ProfilesContext'
import { useRoles } from 'contexts/RolesContext'
import Button from 'components/Button'
import ProfileCard from 'components/ProfileCard'





export function UserAdmin() {
	const {
		connectProfiles,
		isLoaded: profilesIsLoaded,
		profilesByID,
	} = useProfiles()
	const {
		isLoaded: rolesIsLoaded,
		roles,
	} = useRoles()
	const {
		refreshUser,
		user,
	} = useAuth()

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

	const mapProfile = useCallback(profile => (
		<li key={profile.id}>
			<ProfileCard
				linkToProfile
				profile={profile} />

			{rolesIsLoaded && (
				<menu type="toolbar">
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
			)}
		</li>
	), [
		addRole,
		roles,
		rolesIsLoaded,
	])

	connectProfiles()

	return (
		<section className="block">
			{(profilesIsLoaded && rolesIsLoaded) && (
				<ul className="card-list">
					{Object.values(profilesByID).map(mapProfile)}
				</ul>
			)}

			{!profilesIsLoaded && 'Loading...'}
		</section>
	)
}
