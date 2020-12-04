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
import { useFirebase } from 'hooks/useFirebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
// import { useAsync } from 'hooks/useAsync'




const ArticlesContext = React.createContext({
	addArticle: () => {},
	articles: null,
	articlesByID: {},
	articlesBySlug: {},
	connectArticleBySlug: () => {},
	disconnectArticleBySlug: () => {},
	connectAuthorID: () => {},
})





const ArticlesContextProvider = props => {
	const { children } = props
	const { firestore } = useFirebase()
	const {
		current: collection,
	} = useRef(firestore?.collection('articles'))
	const connections = useRef({})
	const [articles, setArticles] = useState(null)
	const [articlesByID, setArticlesByID] = useState({})
	const [articlesBySlug, setArticlesBySlug] = useState({})
	const [authorID, setAuthorID] = useState(null)

	const handleSnapshot = useCallback(snapshot => {
		setArticlesByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setArticlesBySlug(updateStateObjectFromSnapshot(snapshot, 'slug'))
	}, [
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
		delete connections.current[`slug:${slug}`]
	}, [])

	const connectAuthorID = useCallback(newAuthorID => {
		useEffect(() => {
			if (authorID !== newAuthorID) {
				setAuthorID(newAuthorID)
			}

			return () => setAuthorID(null)
		}, [])
	}, [setAuthorID])

	useEffect(() => {
		setArticles(Object.values(articlesByID))
	}, [
		articlesByID,
		setArticles,
	])

	useEffect(() => {
		let query = collection

		if (authorID) {
			query = query.where('authorID', '==', authorID)
		}

		const unsubscribe = query
			.where('isDraft', '==', false)
			.orderBy('publishedAt', 'desc')
			.limit(25)
			.onSnapshot(handleSnapshot)

		return () => {
			unsubscribe()
			setArticles(null)
			setArticlesByID({})
			setArticlesBySlug({})
		}
	}, [
		authorID,
		handleSnapshot,
		setArticles,
		setArticlesByID,
		setArticlesBySlug,
	])

	return (
		<ArticlesContext.Provider
			value={{
				addArticle,
				articles,
				articlesByID,
				articlesBySlug,
				connectArticleBySlug,
				disconnectArticleBySlug,
				connectAuthorID,
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
