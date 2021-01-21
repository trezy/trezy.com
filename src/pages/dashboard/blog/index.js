// Module imports
import { useState } from 'react'
import Link from 'next/link'





// Local imports
import { Tabs } from 'components/Tabs'
import { useAuth } from 'contexts/AuthContext'
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





// Local constants
const TAB_NAMES = ['Published', 'Drafts']





export default function BlogDashboard() {
	const {
		isLoaded,
		user,
	} = useAuth()
	const [activeTab, setActiveTab] = useState(TAB_NAMES[0])

	return (
		<PageWrapper
			breadcrumbs={[
				['Dashboard', '/dashboard'],
				['My Articles', '/dashboard/blog'],
			]}
			title="My Articles">
			<RequireAuthentication>
				{!isLoaded && (
					<section className="block">Loading...</section>
				)}

				<Tabs
					activeTab={activeTab}
					onClick={setActiveTab}
					tabs={TAB_NAMES} />

				{user && (
					<ArticleList
						authorID={user.uid}
						includeDrafts={activeTab === 'Drafts'} />
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
