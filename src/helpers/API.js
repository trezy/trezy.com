/******************************************************************************\
 * Core functions
\******************************************************************************/

function apiFetch(path, options = {}) {
	return fetch(`/api/${path.replace(/^\/+/, '')}`, options)
}

function apiFetchJSON(...args) {
	return apiFetch(...args)
		.then(response => response.json())
}





/******************************************************************************\
 * Helpers
\******************************************************************************/

export function addArticleReaction(articleID, browserID, type) {
	const path = `/blog/${articleID}/reactions/${browserID}/${type}`

	return apiFetchJSON(path, { method: 'post' })
}

export function createBrowserID() {
	return apiFetchJSON('/analytics/createID')
}

export function getReactionsForArticle(articleID, browserID) {
	let path = `/blog/${articleID}/reactions`

	if (browserID) {
		path += `/${browserID}`
	}

	return apiFetchJSON(path)
}

export async function getBrowserID() {
	let browserID = localStorage.getItem('browserID')


	if (!browserID) {
		const response = await createBrowserID()

		browserID = response.id

		localStorage.setItem('browserID', browserID)
	}

	return browserID
}

export function removeArticleReaction(articleID, browserID, type) {
	const path = `/blog/${articleID}/reactions/${browserID}/${type}`

	return apiFetchJSON(path, { method: 'delete' })
}
