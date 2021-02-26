// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react'
import { v4 as uuid } from 'uuid'
import PropTypes from 'prop-types'





// Local imports
import { useAuth } from 'contexts/AuthContext'
import { useFirebase } from 'hooks/useFirebase'
import { calculateReadtime } from 'helpers/calculateReadtime'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
import articleDefaults from 'models/article'
import createSlugFromTitleString from 'helpers/createSlugFromTitleString'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'





// Constants
const INITIAL_STATE = {
	article: null,
	isLoadingArticle: true,
	isLoadingResponses: true,
	responses: null,
}





function reducer(state, action) {
	const {
		payload,
		type,
	} = action
	const newState = { ...state }

	switch (type) {
		case 'attempt article retrieval':
			newState.isLoadingArticle = true
			break

		case 'received article':
			newState.isLoadingArticle = false
			newState.article = {
				...payload,
				readtime: calculateReadtime(payload.body),
			}
			break

		case 'received responses':
			newState.isLoadingResponses = false
			newState.responses = payload
			break

		default:
			console.warn(`Unrecognized action type: ${type}`, payload)
			return state
	}

	return newState
}




const ArticleContext = React.createContext({
	...INITIAL_STATE,
	publishResponse: () => {},
	saveArticle: () => {},
})

const ArticleContextProvider = props => {
	const {
		children,
		id,
		isNew,
		slug,
	} = props
	console.log('===== BEEP BEEP BEEP =====')
	console.log({props, readtime: calculateReadtime(props.article.body)})
	const [state, dispatch] = useReducer(reducer, {
		...INITIAL_STATE,
		article: props.article ? {
			...props.article,
			readtime: calculateReadtime(props.article.body)
		} : null,
		isLoading: Boolean(props.article),
	})
	console.log({state})
	console.log('===== BEEP BEEP BEEP =====')
	const {
		database,
		firebase,
		firestore,
	} = useFirebase()
	const { user } = useAuth()
	const {
		current: collection,
	} = useRef(firestore?.collection('articles'))

	const { article } = state

	const handleArticleSnapshot = useCallback(snapshot => {
		let article = null

		if (snapshot.forEach) {
			snapshot.forEach(doc => {
				article = {
					...doc.data(),
					id: doc.id,
				}
			})
		} else {
			article = {
				...snapshot.data(),
				id: snapshot.id,
			}
		}

		dispatch({
			payload: article,
			type: 'received article',
		})
	}, [dispatch])

	const handleResponsesSnapshot = useCallback(snapshot => {
		const newResponses = []

		snapshot.forEach(doc => newResponses.push({
			...doc.data(),
			id: doc.id,
		}))

		dispatch({
			payload: newResponses,
			type: 'received responses',
		})
	}, [dispatch])

	const publishResponse = useCallback(async response => {
		if (!user) {
			throw new Error('Can\'t publish response: User not logged in.')
		}

		const ipResponse = await fetch('https://api.ipify.org/?format=json')
		const { ip } = await ipResponse.json()

		const now = firebase.firestore.Timestamp.now()
		const serializedResponse = {
			articleID: article.id,
			authorID: user.uid,
			body: response,
			createdAt: now,
			isPendingAkismetVerification: true,
			isPendingHumanVerification: false,
			isSpam: false,
			publishedAt: now,
			spamCheck: {
				ip,
				useragent: navigator.userAgent,
			},
			updatedAt: now,
		}

		return firestore
			.collection('responses')
			.add(serializedResponse)
	}, [
		article,
		user,
	])

	const saveArticle = useCallback(async (articleChanges, shouldPublish = false) => {
		const articleID = isNew ? uuid() : article.id
		const now = firebase.firestore.Timestamp.now()
		const serializedArticle = {
			...article,
			...articleChanges,
			authorID: article.authorID || user.uid,
			createdAt: now,
			id: articleID,
			isDraft: shouldPublish ? false : article.isDraft,
			publishedAt: shouldPublish ? now : article.publishedAt,
			updatedAt: now,
		}

		if (articleChanges.title !== article.title) {
			const newSlug = createSlugFromTitleString(createTitleStringFromArticle(serializedArticle))

			if (!isNew && (article.slug !== newSlug)) {
				serializedArticle.oldSlugs.push(serializedArticle.slug)
			}

			serializedArticle.slug = newSlug
		}

		const documentReference = collection.doc(articleID)

		if (isNew) {
			await documentReference.set(serializedArticle)
		} else {
			await documentReference.update(serializedArticle)
		}

		return serializedArticle
	}, [
		article,
		user,
	])

	// Connect the article
	useEffect(() => {
		if (!isNew) {
			dispatch({ type: 'attempt article retrieval' })

			let query = collection

			if (slug) {
				query = query
					.where('slug', '==', slug)
					.where('isDraft', '==', false)
			} else if (id) {
				query = query.doc(id)
			}

			if (slug || id) {
				return query.onSnapshot(handleArticleSnapshot)
			}
		}
	}, [
		handleArticleSnapshot,
		id,
		isNew,
		slug,
	])

	// Get all responses to this article
	useEffect(() => {
		if (!isNew && (article?.isDraft === false)) {
			return firestore
				.collection('responses')
				.where('articleID', '==', article.id)
				.where('isSpam', '==', false)
				.where('isPendingAkismetVerification', '==', false)
				.where('isPendingHumanVerification', '==', false)
				.orderBy('publishedAt', 'asc')
				.onSnapshot(handleResponsesSnapshot)
		}
	}, [
		article,
		handleResponsesSnapshot,
	])

	return (
		<ArticleContext.Provider
			value={{
				...state,
				publishResponse,
				saveArticle,
			}}>
			{children}
		</ArticleContext.Provider>
	)
}

ArticleContextProvider.defaultProps = {
	article: null,
	id: null,
	isNew: false,
	slug: null,
}

ArticleContextProvider.propTypes = {
	article: PropTypes.any,
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
	isNew: PropTypes.bool,
	slug: PropTypes.string,
}

const useArticle = () => useContext(ArticleContext)





export {
	ArticleContext,
	ArticleContextProvider,
	useArticle,
}
