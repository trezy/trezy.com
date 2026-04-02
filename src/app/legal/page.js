// Module imports
import Link from 'next/link'

// Component imports
import { PageContent } from 'components/PageContent.js'

export const metadata = {
	title: 'Legal Documents',
	description: 'Legal Documents',
}

export default function Legal() {
	return (
		<PageContent title="Legal Documents">
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
		</PageContent>
	)
}
