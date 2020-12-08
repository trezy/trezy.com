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
import { useAuth } from 'contexts/AuthContext'
import { useFirebase } from 'hooks/useFirebase'
import { updateStateObjectFromSnapshot } from 'helpers/updateStateObjectFromSnapshot'
import articleDefaults from 'models/article'
// import { useAsync } from 'hooks/useAsync'




const ArticleContext = React.createContext({
	article: null,
	isLoaded: false,
	publishResponse: () => {},
	responses: null,
})





const ArticleContextProvider = props => {
	const {
		article: articleFromSSR,
		children,
		id,
		isNew,
		slug,
	} = props
	const {
		firebase,
		firestore,
	} = useFirebase()
	const { user } = useAuth()
	const {
		current: collection,
	} = useRef(firestore?.collection('articles'))
	const connections = useRef({})
	const [article, setArticle] = useState(
		articleFromSSR ||
		(isNew ? articleDefaults : null)
	)
	const [isLoaded, setisLoaded] = useState(isNew)
	const [responses, setResponses] = useState(null)

	const handleArticleSnapshot = useCallback(snapshot => {
		if (snapshot.forEach) {
			snapshot.forEach(doc => {
				setArticle({
					...doc.data(),
					id: doc.id,
				})
			})
		} else {
			setArticle({
				...snapshot.data(),
				id: snapshot.id,
			})
		}

		setisLoaded(true)
	}, [
		setArticle,
		setisLoaded,
	])

	const handleResponsesSnapshot = useCallback(snapshot => {
		const newResponses = []

		snapshot.forEach(doc => newResponses.push({
			...doc.data(),
			id: doc.id,
		}))

		setResponses(newResponses)
	}, [setResponses])

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

	const saveArticle = useCallback(async articleChanges => {
		const now = firebase.firestore.Timestamp.now()
		const serializedArticle = {
			...article,
			...articleChanges,
			authorID: article.authorID || user.uid,
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

		if (article.createdAt) {
			serializedArticle.createdAt = firebase.firestore.Timestamp.fromMillis(article.createdAt.seconds * 1000)
		}

		if (isNew) {
			return collection.add(serializedArticle)
		}

		return collection.doc(article.id).update(serializedArticle)
	}, [
		article,
		user,
	])

	// Connect the article
	useEffect(() => {
		if (!isNew) {
			let query = collection

			if (slug) {
				query = query.where('slug', '==', slug)
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
				article,
				isLoaded,
				publishResponse,
				responses,
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
