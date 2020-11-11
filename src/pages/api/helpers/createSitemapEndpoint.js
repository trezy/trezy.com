// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import xml from 'xml'





// Local imports
import httpStatus from 'helpers/httpStatus'





export default function createSitemapEndpoint(xmlObject) {
	const handler = async (request, response) => {
		if (typeof xmlObject === 'function') {
			xmlObject = await xmlObject()
		}

		const body = xml(xmlObject, {
			declaration: true,
			indent: '\t',
		})

		response.setHeader('content-type', 'text/xml')
		response.status(httpStatus.OK)
		response.send(body)
	}

	const endpoint = createEndpoint({
		allowedMethods: ['get'],
		handler,
	})

	return {
		endpoint,
		handler,
	}
}
