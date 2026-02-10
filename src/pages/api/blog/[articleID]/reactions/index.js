// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'




async function handler(request, response) {
	response.setHeader('cache-control', 'max-age=0, s-maxage=60')
	response.status(httpStatus.OK)
	response.json([])
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
