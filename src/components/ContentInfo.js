// Module imports
import Link from 'next/link'





// Local imports
import { SocialNav } from 'components/SocialNav'





export function ContentInfo() {
	return (
		<footer
			className="block"
			role="contentinfo">
			<nav
				className="trezy"
				aria-labelledby="contentinfo-trezy-header">
				<header id="contentinfo-trezy-header">
					Trezy
				</header>

				<ul>
					<li>
						<Link href="/">
							Home
						</Link>
					</li>

					<li>
						<Link href="/about">
							About
						</Link>
					</li>

					<li>
						<Link href="/blog">
							Blog
						</Link>
					</li>

					<li>
						<Link href="/uses">
							/uses
						</Link>
					</li>
				</ul>
			</nav>

			<nav
				className="account"
				aria-labelledby="contentinfo-account-header">
				<header id="contentinfo-account-header">
					Account
				</header>

				<ul>
					<li>
						<Link href="/settings">
							Settings
						</Link>
					</li>
				</ul>
			</nav>

			<nav
				className="resources"
				aria-labelledby="contentinfo-resources-header">
				<header id="contentinfo-resources-header">
					Resources
				</header>

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
			</nav>

			<SocialNav />
		</footer>
	)
}
