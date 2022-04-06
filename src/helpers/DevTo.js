/******************************************************************************\
 * Core functions
\******************************************************************************/

function apiFetch(path, options = {}) {
	const compiledURL = new URL(path.replace(/^\/+/, ''), 'https://dev.to/api/')

	return fetch(compiledURL, options)
}

function apiFetchJSON(...args) {
	return apiFetch(...args)
		.then(response => response.json())
}





/******************************************************************************\
 * Helpers
\******************************************************************************/

export function getArticle(articleID) {
	return apiFetchJSON(`/articles/${articleID}`)
}
