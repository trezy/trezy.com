// Module imports
import {
	isEmpty,
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import Link from 'next/link'
import React from 'react'





// Component imports
import PageWrapper from 'components/PageWrapper'
import ProfileCard from 'components/ProfileCard'
import RequireAuthentication from 'components/RequireAuthentication'
import useAuthSelector from 'store/selectors/useAuthSelector'
import useUsersSelector from 'store/selectors/useUsersSelector'





export default function UserAdminPage() {
	const auth = useAuthSelector()
	const users = useUsersSelector()

	useFirestoreConnect([{
		collection: 'users',
		// limit: 50,
		// orderBy: ['username', 'desc'],
	}])

	return (
		<PageWrapper
			breadcrumbs={[
				['Admin', '/admin'],
				['Users', '/admin/users'],
			]}
			title="Manage Users">
			<RequireAuthentication>
				<section className="block">
					{isLoaded(users) && (
						<ul className="card-list">
							{users.map(user => (
								<li key={user.id}>
									<ProfileCard
										linkToProfile
										user={user} />
								</li>
							))}
						</ul>
					)}

					{!isLoaded(users) && 'Loading...'}
				</section>
			</RequireAuthentication>
		</PageWrapper>
	)
}
