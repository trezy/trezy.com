// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





async function handler(request, response) {
	const { body } = request

	if (request.headers['x-contentful-api-token'] !== process.env.CONTENTFUL_API_ACCESS_TOKEN) {
		response.status(httpStatus.UNAUTHORIZED)
		return response.json({ message: 'Invalid token' })
	}

	const requestData = JSON.parse(body)

	if (requestData.sys.type === 'DeletedEntry') {
		response.status(httpStatus.OK)
		return response.json({ revalidated: false })
	}

	if (requestData.fields) {
		try {
			let slug = requestData.fields?.slug?.['en-US']

			if (!slug) {
				({ slug } = await Contentful.getArticleByID(requestData.sys.id, true))
			}

			await response.revalidate(`/blog/${slug}`)
			await response.revalidate('/blog')
			await response.revalidate('/')

			response.status(httpStatus.OK)
			response.json({ revalidated: true })
		} catch (error) {
			console.log(error)
			return response.status(500).send('Error revalidating')
		}
	}
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
