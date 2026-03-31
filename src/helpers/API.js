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

export function getReactionsForArticle(articleID) {
	return apiFetchJSON(`/blog/${articleID}/reactions`)
}

export function getAtprotoReactionsForUser(articleID, did) {
	return apiFetchJSON(`/blog/${articleID}/reactions/atproto/${encodeURIComponent(did)}`)
}

export function addAtprotoReaction(articleID, did, type, atprotoRkey) {
	return apiFetch(`/blog/${articleID}/reactions/atproto`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ did, type, atprotoRkey }),
	})
}

export function removeAtprotoReaction(articleID, did, type) {
	return apiFetch(`/blog/${articleID}/reactions/atproto`, {
		method: 'delete',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ did, type }),
	})
}
