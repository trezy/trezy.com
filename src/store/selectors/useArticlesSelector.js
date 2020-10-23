// Module imports
import { useSelector } from 'react-redux'





const useArticlesSelector = (options = {}) => useSelector(({ firestore }) => {
	const {
		filters,
	} = options
	const { articles } = firestore.ordered

	if (articles && filters) {
		return articles.filter(article => {
			const pairs = Object.entries(filters)

			return pairs.every(([filterKey, filterValue]) => (article[filterKey] === filterValue))
		})
	}

	return articles
})





export default useArticlesSelector
