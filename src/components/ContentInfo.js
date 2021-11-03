// Module imports
import Link from 'next/link'
import React from 'react'





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
							<a>Home</a>
						</Link>
					</li>

					<li>
						<Link href="/about">
							<a>About</a>
						</Link>
					</li>

					<li>
						<Link href="/blog">
							<a>Blog</a>
						</Link>
					</li>

					<li>
						<Link href="/uses">
							<a>/uses</a>
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
							<a>Settings</a>
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
			</nav>

			<SocialNav />
		</footer>
	)
}
