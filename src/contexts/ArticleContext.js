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
// import { useAsync } from 'hooks/useAsync'




const ArticleContext = React.createContext({
	article: null,
	publishResponse: () => {},
	responses: null,
})





const ArticleContextProvider = props => {
	const {
		article: articleFromSSR,
		children,
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
	const [article, setArticle] = useState(articleFromSSR || null)
	const [responses, setResponses] = useState(null)

	const handleArticleSnapshot = useCallback(snapshot => {
		snapshot.forEach(doc => {
			setArticle({
				...doc.data(),
				id: doc.id,
			})
		})
	}, [setArticle])

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

	useEffect(() => {
		return collection
			.where('isDraft', '==', false)
			.where('slug', '==', slug)
			.onSnapshot(handleArticleSnapshot)
	}, [
		handleArticleSnapshot,
		slug,
	])

	useEffect(() => {
		if (article) {
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
				publishResponse,
				responses,
			}}>
			{children}
		</ArticleContext.Provider>
	)
}

ArticleContextProvider.defaultProps = {
	article: null,
}

ArticleContextProvider.propTypes = {
	article: PropTypes.any,
	children: PropTypes.node.isRequired,
	slug: PropTypes.string.isRequired,
}

const useArticle = () => useContext(ArticleContext)





export {
	ArticleContext,
	ArticleContextProvider,
	useArticle,
}
