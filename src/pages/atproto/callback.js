import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PageWrapper from 'components/PageWrapper'
import { useATProto } from 'contexts/ATProtoContext.js'

export default function ATProtoCallback() {
	const router = useRouter()
	const { isLoading } = useATProto()

	useEffect(() => {
		if (isLoading) return

		const pending = sessionStorage.getItem('pendingAtprotoReaction')
		let redirectPath = '/'

		if (pending) {
			try {
				const { articleSlug } = JSON.parse(pending)
				redirectPath = `/blog/${articleSlug}`
			} catch {
				// ignore parse errors
			}
		}

		router.replace(redirectPath)
	}, [isLoading, router])

	return (
		<PageWrapper title="Logging in...">
			<section className="block hero">
				<p>{'Completing AT Protocol login...'}</p>
			</section>
		</PageWrapper>
	)
}
