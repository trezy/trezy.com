// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { supabase } from 'helpers/supabase.js'




async function handler(request, response) {
	const { articleID, browserID } = request.query

	const { data, error } = await supabase
		.from('reactions')
		.select('type')
		.eq('article_id', articleID)
		.eq('browser_id', browserID)

	if (error) {
		response.status(httpStatus.INTERNAL_SERVER_ERROR)
		return response.json({ error: error.message })
	}

	response.status(httpStatus.OK)
	response.json(data.map(row => row.type))
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
