// Module imports
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'





// Local imports
import { Changelog } from '../../helpers/markdownRenderers/Changelog.js'
import { DependencyTable } from '../../components/DependencyTable/DependencyTable.js'
import { Tabs } from '../../components/NewTabs/Tabs.js'
import { TabPanel } from '../../components/NewTabs/TabPanel.js'





export function ArticleMeta(props) {
	const {
		article,
		changelog,
		dependencies,
	} = props
	const { readtime } = article

	const [
		publishedAt,
		updatedAt,
	] = useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
		})

		return [
			formatter.format(new Date(article.createdAt)),
			formatter.format(new Date(article.updatedAt)),
		]
	}, [
		article.createdAt,
		article.updatedAt,
	])

	return (
		<div className={'meta'}>
			<div className={'meta-bar'}>
				<span>
					<FontAwesomeIcon
						fixedWidth
						icon={faClock} />
					{' '}
					{`Published ${publishedAt}`}
				</span>

				{(publishedAt !== updatedAt) && (
					<span>
						<FontAwesomeIcon
							fixedWidth
							icon={faClock} />
						{' '}
						{`Updated ${updatedAt}`}
					</span>
				)}

				<span>
					<FontAwesomeIcon
						fixedWidth
						icon={faClock} />
						{' '}
					{/* Less than a minute */}
					{(readtime < (60 * 1000)) && (
						'Less than 1 min read'
					)}

					{/* More than a minute, less than 90 */}
					{(readtime > (60 * 1000)) && (
						`${Math.round(readtime / 1000 / 60)} min read`
					)}
				</span>
			</div>

			<div className={'meta-tabs'}>
				{(Boolean(changelog) || Boolean(dependencies)) && (
					<Tabs>
						{Boolean(changelog) && (
							<TabPanel title={'Changelog'}>
								<Changelog changelog={changelog} />
							</TabPanel>
						)}

						{Boolean(dependencies) && (
							<TabPanel title={'Dependencies'}>
								<DependencyTable dependencies={dependencies} />
							</TabPanel>
						)}
					</Tabs>
				)}
			</div>
		</div>
	)
}
