// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Alert } from 'components/Alert'
import { ArticleSummary } from 'components/ArticleSummary'
import { useCallback, useMemo } from 'react'





export default function ArticleList(props) {
	const {
		className = '',
		includeStyles = true,
		limit = null,
	} = props
	let { articles = null } = props

	const mapArticles = useCallback(article => {
		return (
			<li
				className={classnames({
					block: includeStyles,
				})}
				key={article.id}>
				<ArticleSummary article={article} />
			</li>
		)
	}, [includeStyles])

	const mappedArticles = useMemo(() => {
		let articlesToMap = articles

		if (articles) {
			if (limit) {
				articlesToMap = articles.slice(0, limit)
			}

			return articlesToMap.map(mapArticles)
		}

		return null
	}, [
		articles,
		limit,
		mapArticles,
	])

	if (!mappedArticles) {
		return (
			<Alert type="informational">
				No articles found! <span aria-label="Sobbing face emoji" role="img">😭</span>
			</Alert>
		)
	}

	return (
		<ol className={classnames('article-list', className)}>
			{mappedArticles}
		</ol>
	)
}

ArticleList.propTypes = {
	articles: PropTypes.array,
	authorID: PropTypes.string,
	className: PropTypes.string,
	includeDrafts: PropTypes.bool,
	includeStyles: PropTypes.bool,
	limit: PropTypes.number,
}
