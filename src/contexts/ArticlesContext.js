// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
// import LocalForage from 'localforage'
import PropTypes from 'prop-types'





// Local imports
import { firestore } from 'helpers/firebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
// import { useAsync } from 'hooks/useAsync'
// import { useFirebaseAuthentication } from 'hooks/useFirebaseAuthentication'




const ArticlesContext = React.createContext({
	addArticle: () => {},
	articles: null,
	articlesByID: {},
	articlesBySlug: {},
	connectArticleBySlug: () => {},
	connectArticleQuery: () => {},
	disconnectArticleBySlug: () => {},
	disconnectArticleQuery: () => {},
})





const ArticlesContextProvider = props => {
	const { children } = props
	const {
		current: collection,
	} = useRef(firestore?.collection('articles'))
	const connections = useRef({})
	const [articles, setArticles] = useState(null)
	const [articlesByID, setArticlesByID] = useState({})
	const [articlesBySlug, setArticlesBySlug] = useState({})

	const handleSnapshot = useCallback(snapshot => {
		setArticlesByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setArticlesBySlug(updateStateObjectFromSnapshot(snapshot, 'slug'))
	}, [
		setArticles,
		setArticlesByID,
		setArticlesBySlug,
	])

	const addArticle = useCallback(article => {
		setArticlesByID(previousValue => {
			return {
				...previousValue,
				[article.id]: article,
			}
		})
		setArticlesBySlug(previousValue => {
			return {
				...previousValue,
				[article.slug]: article,
			}
		})
	}, [
		setArticlesByID,
		setArticlesBySlug,
	])

	const connectArticleBySlug = useCallback(slug => {
		connections.current[`slug:${slug}`] = collection
			.where('slug', '==', slug)
			.onSnapshot(handleSnapshot)
	}, [handleSnapshot])

	const disconnectArticleBySlug = useCallback(slug => {
		connections.current[`slug:${slug}`]()
	}, [])

	const connectArticleQuery = useCallback(options => {
		const {
			authorID = null,
			includeDraft = false,
			limit = 0,
		} = options
		let query = collection

		query = query.where('isDraft', '==', includeDraft)

		if (authorID) {
			query = query.where('authorID', '==', authorID)
		}

		if (limit) {
			query = query.limit(limit)
		}

		if (includeDraft) {
			query = query.orderBy('createdAt', 'desc')
		} else {
			query = query.orderBy('publishedAt', 'desc')
		}

		connections.current[`query`] = query.onSnapshot(handleSnapshot)
	}, [handleSnapshot])

	const disconnectArticleQuery = useCallback(() => {
		connections.current[`query`]()
	}, [handleSnapshot])

	useEffect(() => {
		setArticles(Object.values(articlesByID))
	}, [
		articlesByID,
		setArticles,
	])

	return (
		<ArticlesContext.Provider
			value={{
				addArticle,
				articles,
				articlesByID,
				articlesBySlug,
				connectArticleBySlug,
				connectArticleQuery,
				disconnectArticleBySlug,
				disconnectArticleQuery,
			}}>
			{children}
		</ArticlesContext.Provider>
	)
}

ArticlesContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useArticles = () => useContext(ArticlesContext)





export {
	ArticlesContext,
	ArticlesContextProvider,
	useArticles,
}
