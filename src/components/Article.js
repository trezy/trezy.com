// Module imports
import { isLoaded } from 'react-redux-firebase'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import ArticleMeta from 'components/ArticleMeta'
import MarkdownRenderer from 'components/MarkdownRenderer'





const Article = props => {
	const {
		id,
		showTitle,
	} = props
	const { locale } = useRouter()

	const article = useSelector(state => state.firestore.data.articles?.[id])

	if (!isLoaded(article)) {
		return (
			<div>Loading...</div>
		)
	}

	const {
		authorID,
		body_translated,
		createdAt,
		isDraft,
		publishedAt,
		slug,
		subtitle,
		synopsis,
		title,
		updatedAt,
	} = article
	const body = article.body_translated?.[locale] || article.body

	return (
		<article className="block">
			{showTitle && (
				<>
					<h2>{title}</h2>

					{subtitle && (
						<span className="subtitle">
							{subtitle}
						</span>
					)}
				</>
			)}

			<ArticleMeta {...{
				authorID,
				createdAt,
				id,
				isDraft,
				publishedAt,
				updatedAt,
			}} />

			<MarkdownRenderer children={`${synopsis || ''}\n\n${body}`} />
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
