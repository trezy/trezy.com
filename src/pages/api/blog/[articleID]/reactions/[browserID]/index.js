// Module imports
import { PrismaClient } from '@prisma/client'





// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function handler(request, response) {
	const {
		query: {
			articleID,
			browserID,
		},
	} = request

	const prisma = new PrismaClient()
	const userReactions = await prisma.articleReaction
		.groupBy({
			by: ['type'],
			where: {
				articleID,
				browserID,
			},
		})

	response.status(httpStatus.OK)
	response.json(userReactions.map(reaction => reaction.type))
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
