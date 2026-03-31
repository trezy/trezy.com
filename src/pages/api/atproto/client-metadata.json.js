const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://trezy.codes'

export default function handler(request, response) {
	response.setHeader('Content-Type', 'application/json')
	response.setHeader('Access-Control-Allow-Origin', '*')
	response.json({
		client_id: `${SITE_URL}/api/atproto/client-metadata.json`,
		client_name: 'trezy.codes',
		client_uri: SITE_URL,
		logo_uri: `${SITE_URL}/favicon/android-chrome-512x512.png`,
		redirect_uris: [`${SITE_URL}/atproto/callback`],
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code'],
		scope: 'atproto repo:codes.trezy.reaction?action=create repo:codes.trezy.reaction?action=delete',
		token_endpoint_auth_method: 'none',
		application_type: 'web',
		dpop_bound_access_tokens: true,
	})
}
