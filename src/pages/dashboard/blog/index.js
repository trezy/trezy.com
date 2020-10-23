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
		<PageWrapper title="Blog Dashboard">
			<RequireAuthentication>
				<section>
					<header className="page-header">
						<h2>Dashboard / Blog</h2>

						<Link
							as="/dashboard/blog/edit/new"
							href="/dashboard/blog/edit/[id]">
							<a className="button primary">
								<span>New Article</span>
							</a>
						</Link>
					</header>

					{isLoaded(auth) && (
						<ArticleList
							authorID={auth.uid}
							editMode
							includeDraft />
					)}

					{!isLoaded(auth) && 'Loading...'}
				</section>
			</RequireAuthentication>
		</PageWrapper>
	)
}
