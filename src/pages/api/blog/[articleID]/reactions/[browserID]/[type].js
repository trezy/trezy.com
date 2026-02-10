// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'




async function handler(request, response) {
	response.status(httpStatus.NO_CONTENT)
	response.end()
}




export default createEndpoint({
	allowedMethods: [
		'delete',
		'post',
	],
	handler,
})
