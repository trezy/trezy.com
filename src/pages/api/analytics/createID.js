// Module imports
import { v4 as uuid } from 'uuid'




// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'




async function handler(request, response) {
	response.status(httpStatus.OK)
	response.json({
		id: uuid(),
	})
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
