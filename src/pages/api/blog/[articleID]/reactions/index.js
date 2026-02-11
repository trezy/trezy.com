// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { supabase } from 'helpers/supabase.js'




async function handler(request, response) {
	const { articleID } = request.query

	const { data, error } = await supabase
		.from('reactions')
		.select('type')
		.eq('article_id', articleID)

	if (error) {
		response.status(httpStatus.INTERNAL_SERVER_ERROR)
		return response.json({ error: error.message })
	}

	const counts = {}

	data.forEach(row => {
		counts[row.type] = (counts[row.type] || 0) + 1
	})

	const result = Object.entries(counts).map(([type, count]) => ({ type, count }))

	response.setHeader('cache-control', 'max-age=0, s-maxage=60')
	response.status(httpStatus.OK)
	response.json(result)
}




export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
