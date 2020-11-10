// Module imports
import { isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import ArticleMeta from 'components/ArticleMeta'
import MarkdownRenderer from 'components/MarkdownRenderer'





const Article = props => {
	const { id } = props

	const article = useSelector(state => state.firestore.data.articles?.[id])

	if (!isLoaded(article)) {
		return (
			<div>Loading...</div>
		)
	}

	const {
		authorID,
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
		<article className="summary">
			<h3>
				<Link
					as={`/blog/${slug}`}
					href="/blog/[slug]">
					<a>{title}</a>
				</Link>
			</h3>

			<ArticleMeta {...{
				authorID,
				createdAt,
				id,
				isDraft,
				publishedAt,
				updatedAt,
			}} />

			{synopsis && (
				<span className="synopsis">
					{synopsis}
				</span>
			)}
		</article>
	)
}

Article.defaultProps = {
	id: null,
}

Article.propTypes = {
	id: PropTypes.string,
}





export default Article
