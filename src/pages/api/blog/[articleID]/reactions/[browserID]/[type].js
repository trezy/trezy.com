// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { supabase } from 'helpers/supabase.js'




async function handler(request, response) {
	const { articleID, browserID, type } = request.query

	if (request.method.toLowerCase() === 'post') {
		const { error } = await supabase
			.from('reactions')
			.upsert(
				{ article_id: articleID, browser_id: browserID, type },
				{ onConflict: 'article_id,browser_id,type' },
			)

		if (error) {
			response.status(httpStatus.INTERNAL_SERVER_ERROR)
			return response.json({ error: error.message })
		}

		response.status(httpStatus.NO_CONTENT)
		return response.end()
	}

	if (request.method.toLowerCase() === 'delete') {
		const { error } = await supabase
			.from('reactions')
			.delete()
			.eq('article_id', articleID)
			.eq('browser_id', browserID)
			.eq('type', type)

		if (error) {
			response.status(httpStatus.INTERNAL_SERVER_ERROR)
			return response.json({ error: error.message })
		}

		response.status(httpStatus.NO_CONTENT)
		return response.end()
	}
}




export default createEndpoint({
	allowedMethods: [
		'delete',
		'post',
	],
	handler,
})
