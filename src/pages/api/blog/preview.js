// Local imports
import * as Contentful from 'helpers/Contentful'





export default async function handler(request, response) {
	const { slug } = request.query

	const post = await Contentful.getArticle(slug, true)

	if (!post) {
		return response.status(401).json({ message: 'Invalid slug' })
	}

	response.setPreviewData({})
	response.redirect(`/blog/${post.slug}`)
}
