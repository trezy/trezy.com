// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { articlesInitialState } from 'contexts/articlesInitialState'
import { articlesReducer } from 'contexts/articlesReducer'
import { useFirebase } from 'hooks/useFirebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'





// Local constants
const ArticlesContext = React.createContext({
	articles: [],
	articlesByID: {},
	articlesBySlug: {},
	drafts: [],
	draftsByID: {},
	draftsBySlug: {},
	useArticles: () => {},
})





const ArticlesContextProvider = props => {
	const { children } = props
	const { firestore } = useFirebase()
	const [state, dispatch] = useReducer(articlesReducer, articlesInitialState)

	const {
		current: collection,
	} = useRef(firestore?.collection('articles'))

	const handleSnapshot = useCallback(snapshot => {
		const payload = {}

		snapshot.docChanges().forEach(change => {
			const {
				doc,
				type,
			} = change
			const data = {
				...doc.data(),
				id: doc.id,
			}

			let key = 'update'

			if (type === 'removed') {
				key = 'remove'
			}

			if (!payload[key]) {
				payload[key] = []
			}

			payload[key].push(data)
		})

		dispatch({
			payload,
			type: 'MODIFY ARTICLES',
		})
	}, [dispatch])

	const connectArticles = useCallback(options => {
		if (options.preloadedArticles) {
			dispatch({
				payload: {
					update: options.preloadedArticles,
				},
				type: 'MODIFY ARTICLES',
			})
		}

		let query = collection

		if (options.authorID) {
			query = query.where('authorID', '==', options.authorID)
		}

		if (options.includeDrafts) {
			query = query
				.where('isDraft', '==', true)
				.orderBy('createdAt', 'desc')
		} else {
			query = query
				.where('isDraft', '==', false)
				.orderBy('publishedAt', 'desc')
		}

		const unsubscribe = query
			.limit(25)
			.onSnapshot(handleSnapshot)

		return () => {
			unsubscribe()
			dispatch({ type: 'RESET ARTICLES' })
		}
	}, [
		dispatch,
		handleSnapshot,
	])

	const useArticles = useCallback((options, dependencies = []) => {
		useEffect(() => connectArticles(options), [connectArticles, ...dependencies])
	}, [connectArticles])

	return (
		<ArticlesContext.Provider
			value={{
				...state,
				useArticles,
			}}>
			{children}
		</ArticlesContext.Provider>
	)
}

ArticlesContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useArticlesContext = () => useContext(ArticlesContext)





export {
	ArticlesContext,
	ArticlesContextProvider,
	useArticlesContext,
}
