// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'





// Local imports
import buttondownAPI from 'pages/api/helpers/buttondownAPI'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const newSubscriberResponse = await buttondownAPI.post('/subscribers', {
		body: {
			email: request.body.email,
		},
	})

	if (newSubscriberResponse.ok) {
		const newSubscriber = await newSubscriberResponse.json()
		response.status(httpStatus.OK).json({ data: newSubscriber })
	}

	const errors = await newSubscriberResponse.json()
	response.status(newSubscriberResponse.status).json({ errors })
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
