// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'





// Local imports
import httpStatus from 'helpers/httpStatus'
import getJokes from 'pages/api/helpers/getJokes'





export const handler = (request, response) => {
	const jokes = getJokes(request.query)

	response.status(httpStatus.OK).json({
		data: jokes,
		meta: {
			count: jokes.length,
		},
	})
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
