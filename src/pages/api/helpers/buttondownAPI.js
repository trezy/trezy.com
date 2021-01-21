function bdaFetch (path, options = {}) {
	const fetchOptions = {
		...options,
		headers: {
			Authorization: `Token ${process.env.BUTTONDOWN_API_TOKEN}`,
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	}

	if (!['string', 'undefined'].includes(typeof options.body)) {
		fetchOptions.body = JSON.stringify(options.body)
	}

	return fetch(`https://api.buttondown.email/v1${path}`, fetchOptions)
}

export default {
	get(path, options = {}) {
		return bdaFetch(path, {
			...options,
			method: 'GET',
		})
	},

	post(path, options = {}) {
		return bdaFetch(path, {
			...options,
			method: 'POST',
		})
	},
}
