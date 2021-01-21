export const articlesReducer = (state, action) => {
	const {
		payload,
		type,
	} = action

	if (type === 'MODIFY ARTICLES') {
		const newState = { ...state }

		payload.remove?.forEach(item => {
			if (item.isDraft) {
				delete newState.draftsByID[item.id]
				delete newState.draftsBySlug[item.slug]
			} else {
				delete newState.articlesByID[item.id]
				delete newState.articlesBySlug[item.slug]
			}
		})

		payload.update?.forEach(item => {
			if (item.isDraft) {
				newState.draftsByID[item.id] = item
				newState.draftsBySlug[item.slug] = item
			} else {
				newState.articlesByID[item.id] = item
				newState.articlesBySlug[item.slug] = item
			}
		})

		newState.drafts = Object.values(newState.draftsByID)
		newState.articles = Object.values(newState.articlesByID)

		return newState
	}

	if (type === 'RESET ARTICLES') {
		return {
			articles: [],
			articlesByID: {},
			articlesBySlug: {},
			drafts: [],
			draftsByID: {},
			draftsBySlug: {},
		}
	}

	return state
}
