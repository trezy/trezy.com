import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import * as Contentful from 'helpers/Contentful'

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const slug = searchParams.get('slug')

	if (!slug) {
		return new Response('Missing slug', { status: 400 })
	}

	const post = await Contentful.getArticle(slug, true)

	if (!post) {
		return new Response('Invalid slug', { status: 401 })
	}

	;(await draftMode()).enable()

	redirect(`/blog/${post.slug}`)
}
