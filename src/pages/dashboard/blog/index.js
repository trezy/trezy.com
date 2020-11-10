// Module imports
import { isLoaded } from 'react-redux-firebase'
import Link from 'next/link'
import React from 'react'





// Component imports
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'
import useAuthSelector from 'store/selectors/useAuthSelector'





export default function BlogDashboard() {
	const auth = useAuthSelector()

	return (
		<PageWrapper title="My Articles">
			<RequireAuthentication>
				{isLoaded(auth) && (
					<ArticleList
						authorID={auth.uid}
						editMode
						includeDraft />
				)}

				{!isLoaded(auth) && (
					<section className="block">Loading...</section>
				)}

				<menu
					className="floaty-menu floaty-bottom"
					type="toolbar">
					<Link
						as="/dashboard/blog/edit/new"
						href="/dashboard/blog/edit/[id]">
						<a className="button primary">
							<span>New Article</span>
						</a>
					</Link>
				</menu>

			</RequireAuthentication>
		</PageWrapper>
	)
}
