// Component imports
import { RolesContextProvider } from 'contexts/RolesContext'
import { UserAdmin } from 'components/Admin/Users'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





export default function UserAdminPage() {
	return (
		<PageWrapper
			breadcrumbs={[
				['Admin', '/admin'],
				['Users', '/admin/users'],
			]}
			title="Manage Users">
			<RequireAuthentication>
				<RolesContextProvider>
					<UserAdmin />
				</RolesContextProvider>
			</RequireAuthentication>
		</PageWrapper>
	)
}
