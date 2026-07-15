// Static AT Protocol OAuth client metadata document.
//
// Ports legacy/pages/api/atproto/client-metadata.json.js (a Next.js API
// route that served this JSON dynamically on every request) into a
// build-time-prerendered static file, since this site no longer runs a
// server. All fields mirror the legacy document exactly, except `scope`:
// legacy's prod metadata scoped to the reactions-specific permissions
// (`atproto repo:codes.trezy.reaction?action=create repo:codes.trezy.reaction?action=delete`),
// but legacy's *dev* loopback client already hardcoded
// `atproto transition:generic` (see legacy/contexts/ATProtoContext.js). This
// port standardizes on `atproto transition:generic` for both dev and prod so
// the two paths request the same scope (per Task 20 brief).
import { SITE_URL as SITE } from '../../../lib/site.js'

export const prerender = true

export function GET() {
	const metadata = {
		client_id: `${SITE}/api/atproto/client-metadata.json`,
		client_name: 'trezy.codes',
		client_uri: SITE,
		logo_uri: `${SITE}/favicon/android-chrome-512x512.png`,
		redirect_uris: [`${SITE}/atproto/callback`],
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code'],
		scope: 'atproto transition:generic',
		token_endpoint_auth_method: 'none',
		application_type: 'web',
		dpop_bound_access_tokens: true,
	}

	return new Response(JSON.stringify(metadata), {
		headers: { 'Content-Type': 'application/json' },
	})
}
