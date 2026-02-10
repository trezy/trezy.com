// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'




async function handler(request, response) {
	response.status(httpStatus.OK)
	response.json([])
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
