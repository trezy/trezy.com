import actionTypes from 'store/actionTypes'
import initialState from 'store/initialState'





export default function moviesReducer (state = initialState.movies, action) {
	const {
		payload,
		status,
		type,
	} = action

	switch (type) {
		case actionTypes.FIND_MOVIES:
			switch (status) {
				case 'success':
					return {
						...state,
						...payload.results.reduce((accumulator, movie) => {
							accumulator[movie.id] = movie
							return accumulator
						}, {}),
					}

				default:
					return state
			}

		default:
			return state
	}
}
