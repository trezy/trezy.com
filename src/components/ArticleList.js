// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Anchor } from 'components/Anchor'
import { ArticleMeta } from 'components/ArticleMeta'
import Alert from 'components/Alert'





const ArticleList = props => {
	const {
		className,
		includeStyles,
		limit,
	} = props
	let { articles } = props

	if (Boolean(articles) && limit) {
		articles = articles.slice(0, limit)
	}

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
								<Anchor
									href={`/blog/${slug}`}
									tracking={['select_content', {
										content_type: 'article',
										item_id: id,
									}]}>
									{title}
								</Anchor>
							</h3>

							<ArticleMeta article={article} />

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
	includeDrafts: false,
	includeStyles: true,
	limit: null,
}

ArticleList.propTypes = {
	articles: PropTypes.array,
	authorID: PropTypes.string,
	className: PropTypes.string,
	includeDrafts: PropTypes.bool,
	includeStyles: PropTypes.bool,
	limit: PropTypes.number,
}





export default ArticleList
