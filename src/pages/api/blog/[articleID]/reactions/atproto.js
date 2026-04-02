// Local imports
import createEndpoint from 'pages/api/helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'
import { supabase } from 'helpers/supabase.js'




const MAX_REACTIONS_PER_TYPE = 20

async function handler(request, response) {
	const { articleID } = request.query

	if (request.method.toLowerCase() === 'post') {
		const { did, type } = request.body

		// Check if a row already exists
		const { data: existing } = await supabase
			.from('reactions')
			.select('count')
			.eq('article_id', articleID)
			.eq('did', did)
			.eq('type', type)
			.single()

		if (existing) {
			if (existing.count >= MAX_REACTIONS_PER_TYPE) {
				response.status(httpStatus.OK)
				return response.json({ count: existing.count })
			}

			const { error } = await supabase
				.from('reactions')
				.update({ count: existing.count + 1 })
				.eq('article_id', articleID)
				.eq('did', did)
				.eq('type', type)

			if (error) {
				response.status(httpStatus.INTERNAL_SERVER_ERROR)
				return response.json({ error: error.message })
			}

			response.status(httpStatus.OK)
			return response.json({ count: existing.count + 1 })
		}

		const { error } = await supabase
			.from('reactions')
			.insert({
				article_id: articleID,
				browser_id: did,
				did,
				type,
				count: 1,
			})

		if (error) {
			response.status(httpStatus.INTERNAL_SERVER_ERROR)
			return response.json({ error: error.message })
		}

		response.status(httpStatus.OK)
		return response.json({ count: 1 })
	}

	if (request.method.toLowerCase() === 'delete') {
		const { did, type } = request.body

		const { data: existing } = await supabase
			.from('reactions')
			.select('count')
			.eq('article_id', articleID)
			.eq('did', did)
			.eq('type', type)
			.single()

		if (!existing || existing.count <= 0) {
			response.status(httpStatus.OK)
			return response.json({ count: 0 })
		}

		if (existing.count <= 1) {
			await supabase
				.from('reactions')
				.delete()
				.eq('article_id', articleID)
				.eq('did', did)
				.eq('type', type)

			response.status(httpStatus.OK)
			return response.json({ count: 0 })
		}

		const { error } = await supabase
			.from('reactions')
			.update({ count: existing.count - 1 })
			.eq('article_id', articleID)
			.eq('did', did)
			.eq('type', type)

		if (error) {
			response.status(httpStatus.INTERNAL_SERVER_ERROR)
			return response.json({ error: error.message })
		}

		response.status(httpStatus.OK)
		return response.json({ count: existing.count - 1 })
	}
}




export default createEndpoint({
	allowedMethods: [
		'delete',
		'post',
	],
	handler,
})
