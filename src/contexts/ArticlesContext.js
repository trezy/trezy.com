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
	connectAuthorID: () => {},
	connectDrafts: () => {},
	drafts: null,
	draftsByID: {},
	draftsBySlug: {},
	disconnectArticleBySlug: () => {},
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
	const [drafts, setDrafts] = useState(null)
	const [draftsByID, setDraftsByID] = useState({})
	const [draftsBySlug, setDraftsBySlug] = useState({})
	const [includeDrafts, setIncludeDrafts] = useState(false)

	const handleDraftsSnapshot = useCallback(snapshot => {
		setDraftsByID(updateStateObjectFromSnapshot(snapshot, 'id'))
		setDraftsBySlug(updateStateObjectFromSnapshot(snapshot, 'slug'))
	}, [
		setDraftsByID,
		setDraftsBySlug,
	])

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

	const connectDrafts = useCallback(() => {
		useEffect(() => {
			setIncludeDrafts(true)

			return () => setIncludeDrafts(false)
		}, [])
	}, [setIncludeDrafts])

	useEffect(() => {
		setArticles(Object.values(articlesByID))
	}, [
		articlesByID,
		setArticles,
	])

	useEffect(() => {
		setDrafts(Object.values(draftsByID))
	}, [
		draftsByID,
		setDrafts,
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
			setDrafts(null)
			setDraftsByID({})
			setDraftsBySlug({})
		}
	}, [
		includeDrafts,
		handleSnapshot,
		setDrafts,
		setDraftsByID,
		setDraftsBySlug,
	])

	useEffect(() => {
		if (includeDrafts && authorID) {
			console.log('subscribing to drafts')
			const unsubscribe = collection
				.where('isDraft', '==', true)
				.where('authorID', '==', authorID)
				.orderBy('createdAt', 'desc')
				.limit(25)
				.onSnapshot(handleDraftsSnapshot)

			return () => {
				console.log('unsubscribing from drafts')
				unsubscribe()
				setDrafts(null)
				setDraftsByID({})
				setDraftsBySlug({})
			}
		}
	}, [
		authorID,
		handleSnapshot,
		setDrafts,
		setDraftsByID,
		setDraftsBySlug,
		includeDrafts,
	])

	return (
		<ArticlesContext.Provider
			value={{
				addArticle,
				articles,
				articlesByID,
				articlesBySlug,
				connectArticleBySlug,
				connectAuthorID,
				connectDrafts,
				drafts,
				draftsByID,
				draftsBySlug,
				disconnectArticleBySlug,
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
