/******************************************************************************\
 * Core functions
\******************************************************************************/

function apiFetch(query, options = {}) {
	const body = JSON
		.stringify({
			query,
			variables: {},
		})
		.replace(/(?:\\t|\\n)/gu, ' ')
		.replace(/\s+/gu, ' ')

	return fetch('https://api.hashnode.com/', {
		...options,
		body,
		headers: {
			...options.headers,
			'Content-Type': 'application/json',
			Authorization: process.env.HASHNODE_API_KEY,
		},
		method: 'post',
	})
}

function apiFetchJSON(...args) {
	return apiFetch(...args)
		.then(response => response.json())
}





/******************************************************************************\
 * Helpers
\******************************************************************************/

export function getArticle(articleID) {
	return apiFetchJSON(`query {
		post(slug: "${articleID}", hostname: "trezy.com") {
			totalReactions
			publication {
				domain
			}
		}
	}`)
}
