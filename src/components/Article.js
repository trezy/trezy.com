// Module imports
import { isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import ArticleHeader from 'components/ArticleHeader'
import ArticleMeta from 'components/ArticleMeta'
import MarkdownRenderer from 'components/MarkdownRenderer'





const Article = props => {
	const {
		editMode,
		id,
		summarize,
	} = props

	const article = useSelector(state => state.firestore.data.articles?.[id])

	if (!isLoaded(article)) {
		return (
			<div>Loading...</div>
		)
	}

	const {
		createdAt,
		isDraft,
		publishedAt,
		slug,
		subtitle,
		synopsis,
		title,
		updatedAt,
	} = article

	return (
		<article className={classnames({ summary: summarize })}>
			<ArticleHeader {...{
				slug,
				subtitle,
				summarize,
				title,
			}} />

			<ArticleMeta {...{
				createdAt,
				isDraft,
				publishedAt,
				updatedAt,
			}} />

			{synopsis && (
				<span className="synopsis">
					{synopsis}
				</span>
			)}

			{!summarize && (
				<MarkdownRenderer source={article.body} />
			)}

			{editMode && (
				<menu type="toolbar">
					<Link
						as={`/dashboard/blog/edit/${id}`}
						href="/dashboard/blog/edit/[id]">
						<a className="button primary">
							Edit
						</a>
					</Link>
				</menu>
			)}
		</article>
	)
}

Article.defaultProps = {
	editMode: false,
	id: null,
	summarize: false,
}

Article.propTypes = {
	editMode: PropTypes.bool,
	id: PropTypes.string,
	summarize: PropTypes.bool,
}





export default Article
