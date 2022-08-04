// Module imports
import { PrismaClient } from '@prisma/client'





// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function handler(request, response) {
	const {
		method,
		query: {
			articleID,
			browserID,
			type,
		},
	} = request

	const prisma = new PrismaClient()

	switch (method.toLowerCase()) {
		case 'delete':
			await prisma.articleReaction.deleteMany({
				where: {
					articleID,
					browserID,
					type,
				},
			})

			response.status(httpStatus.NO_CONTENT)
			response.end()
			break

		case 'post':
			await prisma.articleReaction.create({
				data: {
					articleID,
					browserID,
					combinedID: `${articleID}:${browserID}:${type}`,
					type,
				},
			})

			response.status(httpStatus.NO_CONTENT)
			response.end()
			break
	}
}





export default createEndpoint({
	allowedMethods: [
		'delete',
		'post',
	],
	handler,
})
