// Module imports
import classnames from 'classnames'

// Local imports
import Breadcrumbs from 'components/Breadcrumbs.js'
import { ContentInfo } from 'components/ContentInfo.js'

export function PageContent(props) {
	const {
		children,
		className = '',
		showHeader = true,
		title,
		breadcrumbs = null,
	} = props

	return (
		<main className={classnames('page', className, title?.toLowerCase().replace(/\s/gu, '-').replace(/[^a-z0-9-]/gu, ''))}>
			{showHeader && (
				<header className="block">
					<h2>{title}</h2>

					{Boolean(breadcrumbs) && (
						<Breadcrumbs crumbs={breadcrumbs} />
					)}
				</header>
			)}

			{children}

			<ContentInfo />
		</main>
	)
}
