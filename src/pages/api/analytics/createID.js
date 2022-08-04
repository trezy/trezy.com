// Module imports
import { PrismaClient } from '@prisma/client'





// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function handler(request, response) {
	const prisma = new PrismaClient()

	const { id } = await prisma.browser.create({
		data: {},
	})

	response.status(httpStatus.OK)
	response.json({
		id,
	})
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
