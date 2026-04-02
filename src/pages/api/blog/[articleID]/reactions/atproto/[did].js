// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { supabase } from 'helpers/supabase.js'




async function handler(request, response) {
	const { articleID, did } = request.query

	const { data, error } = await supabase
		.from('reactions')
		.select('type, count, atproto_rkey')
		.eq('article_id', articleID)
		.eq('did', did)

	if (error) {
		response.status(httpStatus.INTERNAL_SERVER_ERROR)
		return response.json({ error: error.message })
	}

	response.status(httpStatus.OK)
	response.json(data)
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
