// Local imports
import { MentionsDetail } from 'components/ArticleMentions/MentionsDetail.js'
import { COLLECTION_GROUPS } from 'components/ArticleMentions/api.js'

export async function generateMetadata({ params }) {
	const { collection } = await params
	const group = COLLECTION_GROUPS.find(g => g.id === collection)

	return {
		title: group ? `${group.name} - Mentions` : 'Mentions',
	}
}

export default async function MentionsPage({ params }) {
	const { slug, collection } = await params

	return (
		<MentionsDetail
			groupId={collection}
			slug={slug} />
	)
}
