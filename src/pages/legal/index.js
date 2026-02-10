// Module imports
import Link from 'next/link'





// Component imports
import PageWrapper from 'components/PageWrapper'





export default function PrivacyPolicy() {
	return (
		<PageWrapper
			description="Legal Documents"
			title="Legal Documents">
			<section className="block">
				<ul>
					<li>
						<Link href="/legal/terms-of-service">
							Terms of Service
						</Link>
					</li>

					<li>
						<Link href="/legal/privacy-policy">
							Privacy Policy
						</Link>
					</li>

					<li>
						<Link href="/legal/cookie-policy">
							Cookie Policy
						</Link>
					</li>

					<li>
						<Link href="/legal/code-of-conduct">
							Code of Conduct
						</Link>
					</li>
				</ul>
			</section>
		</PageWrapper>
	)
}
