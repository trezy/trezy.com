import actionTypes from 'store/actionTypes'
import initialState from 'store/initialState'





export default function moviesSearchResultsReducer (state = initialState.moviesSearchResults, action) {
	const {
		payload,
		status,
		type,
	} = action
	const newState = { ...state }

	switch (type) {
		case actionTypes.FIND_MOVIES:
			switch (status) {
				case 'success':
					newState.movies = payload.results.map(({ id }) => id)
					newState.totalResults = payload.totalResults
					return newState

				default:
					return state
			}

		default:
			return state
	}
}
