// Module imports
import { useEffect } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { useArticles } from 'contexts/ArticlesContext'
import Alert from 'components/Alert'
import ArticleMeta from 'components/ArticleMeta'





const ArticleList = props => {
	const {
		authorID,
		className,
		includeDraft,
		includeStyles,
		limit,
	} = props
	const {
		connectArticleQuery,
		disconnectArticleQuery,
		...articleContext
	} = useArticles()

	let articles = articleContext.articles || props.articles

	if (limit) {
		articles = articles.slice(0, limit)
	}

	useEffect(() => {
		connectArticleQuery({
			authorID,
			includeDraft,
			limit,
		})

		return disconnectArticleQuery
	}, [
		connectArticleQuery,
		disconnectArticleQuery,
	])

	if (!articles?.length) {
		return (
			<Alert type="informational">
				No articles found! <span aria-label="Sobbing face emoji" role="img">😭</span>
			</Alert>
		)
	}

	return (
		<ol className={classnames('article-list', className)}>
			{Boolean(articles) && articles.map(article => {
				const {
					id,
					slug,
					synopsis,
					title,
				} = article

				return (
					<li
						className={classnames({
							block: includeStyles,
						})}
						key={id}>
						<article className="summary">
							<h3>
								<Link href={`/blog/${slug}`}>
									<a>{title}</a>
								</Link>
							</h3>

							<ArticleMeta {...article} />

							{synopsis && (
								<span className="synopsis">
									{synopsis}
								</span>
							)}
						</article>
					</li>
				)
			})}
		</ol>
	)
}

ArticleList.defaultProps = {
	articles: null,
	authorID: null,
	className: '',
	includeDraft: false,
	includeStyles: true,
	limit: null,
}

ArticleList.propTypes = {
	articles: PropTypes.array,
	authorID: PropTypes.string,
	className: PropTypes.string,
	includeDraft: PropTypes.bool,
	includeStyles: PropTypes.bool,
	limit: PropTypes.number,
}





export default ArticleList
