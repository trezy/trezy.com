// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Anchor } from 'components/Anchor.js'
import { ArticleMeta } from 'components/ArticleMeta/index.js'
import { getArticleURL } from 'helpers/getArticleURL.js'





export function ArticleSummary(props) {
	const { article } = props

	return (
		<article className="summary">
			<h3>
				<Anchor
					href={getArticleURL(article)}
					tracking={['select_content', {
						content_type: 'article',
						item_id: article.id,
					}]}>
					{article.title}
				</Anchor>
			</h3>

			<ArticleMeta article={article} />

			{article.synopsis && (
				<span className="synopsis">
					{article.synopsis}
				</span>
			)}
		</article>
	)
}

ArticleSummary.propTypes = {
	article: PropTypes.object,
}
