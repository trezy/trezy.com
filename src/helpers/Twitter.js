/******************************************************************************\
 * Core functions
\******************************************************************************/

function apiFetch(path, options = {}) {
	const url = new URL(`/2${path}`, 'https://api.twitter.com')

	if (options.queryParams) {
		Object
			.entries(options.queryParams)
			.forEach(entry => {
				url.searchParams.append(...entry)
			})

		delete options.queryParams
	}

	return fetch(url.toString(), {
		...options,
		headers: {
			...(options.headers || {}),
			Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
		},
	})
}

function apiFetchJSON(...args) {
	return apiFetch(...args)
		.then(response => response.json())
}





/******************************************************************************\
 * Helpers
\******************************************************************************/

export function getTweets(tweetIDs) {
	return apiFetchJSON('/tweets', {
		queryParams: {
			expansions: [
				'attachments.media_keys',
				'author_id',
				'referenced_tweets.id',
				'referenced_tweets.id.author_id',
			].join(','),
			ids: tweetIDs.join(','),
			'tweet.fields': [
				'attachments',
				'author_id',
				'created_at',
				'entities',
				'id',
				'in_reply_to_user_id',
				'public_metrics',
				'referenced_tweets',
				'text',
			].join(','),
			'user.fields': [
				'id',
				'name',
				'profile_image_url',
				'protected',
				'url',
				'username',
				'verified',
			].join(','),
			'media.fields': [
				'alt_text',
				'duration_ms',
				'height',
				'media_key',
				'preview_image_url',
				'public_metrics',
				'type',
				'url',
				'variants',
				'width',
			].join(','),
		}
	})
}
