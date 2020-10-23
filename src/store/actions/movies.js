/* eslint-env node */
// Module imports
import { CancelToken } from 'axios'
import convertObjectKeys from 'convert-object-keys'
import transformStringCase from 'transform-string-case'





// Component imports
import actionTypes from 'store/actionTypes'
import tmdbService from 'services/tmdb'





// Local constants
const cancelTokenSource = CancelToken.source()





export const findMovies = query => async dispatch => {
	cancelTokenSource.cancel()

	try {
		const { data } = await tmdbService().get('/search/movie', {
			params: {
				api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY, /* eslint-disable-line camelcase */
				cancelToken: cancelTokenSource.token,
				query,
			},
			transformResponse: response => {
				const parsedResponse = JSON.parse(response)
				const transformer = key => transformStringCase(key, 'snake', 'camel')
				const transformedResponse = convertObjectKeys(parsedResponse, transformer)

				return transformedResponse
			},
		})

		dispatch({
			payload: data,
			status: 'success',
			type: actionTypes.FIND_MOVIES,
		})
	} catch (error) {
		console.error(error)
	}
}

export const getMovies = () => () => {
	// const { data } = await tmdbService().get('/search/movie', {
	//	 params: {
	//		 api_key: tmdbAPIConfig.apiKey, /* eslint-disable-line camelcase */
	//		 params: { query },
	//	 },
	// })

	// dispatch({
	//	 payload: parseUserFromFirebase(user),
	//	 status: user ? 'success' : 'failure',
	//	 type: actionTypes.GET_MOVIES,
	// })
}
