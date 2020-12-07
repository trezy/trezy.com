// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import { useAuth } from 'contexts/AuthContext'
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'
import useAuthSelector from 'store/selectors/useAuthSelector'





export default function BlogDashboard() {
	const {
		isLoaded,
		user,
	} = useAuth()
	const auth = useAuthSelector()

	return (
		<PageWrapper
			breadcrumbs={[
				['Dashboard', '/dashboard'],
				['My Articles', '/dashboard/blog'],
			]}
			title="My Articles">
			<RequireAuthentication>
				{user && (
					<ArticleList
						authorID={auth.uid}
						includeDraft />
				)}

				{!isLoaded && (
					<section className="block">Loading...</section>
				)}

				<menu
					className="floaty-menu floaty-bottom"
					type="toolbar">
					<Link href="/dashboard/blog/edit/new">
						<a className="button primary">
							<span>New Article</span>
						</a>
					</Link>
				</menu>
			</RequireAuthentication>
		</PageWrapper>
	)
}
