// Module imports
import { PrismaClient } from '@prisma/client'





// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function handler(request, response) {
	const {
		query: { articleID },
	} = request

	const prisma = new PrismaClient()
	const reactionCounts = await prisma.articleReaction
		.groupBy({
			by: ['type'],
			where: { articleID },
			_count: true,
		})

	response.setHeader('cache-control', 'max-age=0, s-maxage=60')
	response.status(httpStatus.OK)
	response.json(reactionCounts.map(reactionCount => {
		return {
			count: reactionCount._count,
			type: reactionCount.type,
		}
	}))
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
