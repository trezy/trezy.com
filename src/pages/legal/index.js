// Module imports
import Link from 'next/link'
import React from 'react'





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
							<a>Terms of Service</a>
						</Link>
					</li>

					<li>
						<Link href="/legal/privacy-policy">
							<a>Privacy Policy</a>
						</Link>
					</li>

					<li>
						<Link href="/legal/cookie-policy">
							<a>Cookie Policy</a>
						</Link>
					</li>

					<li>
						<Link href="/legal/code-of-conduct">
							<a>Code of Conduct</a>
						</Link>
					</li>
				</ul>
			</section>
		</PageWrapper>
	)
}
