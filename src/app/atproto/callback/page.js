'use client'

// Module imports
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Local imports
import { PageContent } from 'components/PageContent.js'
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
		<PageContent title="Logging in...">
			<section className="block hero">
				<p>{'Completing AT Protocol login...'}</p>
			</section>
		</PageContent>
	)
}
