// Module imports
import {
	isEmpty,
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import Alert from 'components/Alert'
import Article from 'components/Article'
import useArticlesSelector from 'store/selectors/useArticlesSelector'





const ArticleList = props => {
	const {
		authorID,
		className,
		editMode,
		includeDraft,
		includePublished,
		limit,
	} = props
	const queryObject = {
		collection: 'articles',
		where: [],
	}

	if (!includeDraft) {
		queryObject.where.push(['isDraft', '==', false])
	}

	if (!includePublished) {
		queryObject.where.push(['isDraft', '==', true])
	}

	if (authorID) {
		queryObject.where.push(['authorID', '==', authorID])
	}

	if (!queryObject.where.length) {
		delete queryObject.where
	}

	if (includePublished && includeDraft) {
		queryObject.orderBy = ['createdAt', 'desc']
	} else if (includePublished) {
		queryObject.orderBy = ['publishedAt', 'desc']
	} else { // includeDraft
		queryObject.orderBy = ['updatedAt', 'desc']
	}

	if (limit) {
		queryObject.limit = limit
	}

	const articles = useArticlesSelector()

	useFirestoreConnect([queryObject])

	if (!isLoaded(articles)) {
		return (
			<div>Loading...</div>
		)
	}

	if (isLoaded(articles) && isEmpty(articles)) {
		return (
			<Alert type="informational">
				No articles found! <span aria-label="Sobbing face emoji" role="img">😭</span>
			</Alert>
		)
	}

	return (
		<ol className={classnames('article-list', className)}>
			{articles.map(({ id }) => (
				<li key={id}>
					<Article
						editMode={editMode}
						id={id}
						shouldLoad={false}
						summarize />
				</li>
			))}
		</ol>
	)
}

ArticleList.defaultProps = {
	authorID: null,
	className: '',
	editMode: false,
	includeDraft: false,
	includePublished: true,
	limit: null,
}

ArticleList.propTypes = {
	authorID: PropTypes.string,
	className: PropTypes.string,
	editMode: PropTypes.bool,
	includeDraft: PropTypes.bool,
	includePublished: PropTypes.bool,
	limit: PropTypes.number,
}





export default ArticleList
