// Module imports
import { useCurrentPageGitInfo } from 'next-gitinfo/hooks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'





// Local imports
import { SocialNav } from 'components/SocialNav'





export function ContentInfo() {
	const gitInfo = useCurrentPageGitInfo()
	const { locale } = useRouter()
	const dateFormatter = new Intl.DateTimeFormat(locale, {
		dateStyle: 'full',
		timeStyle: 'short',
	})

	const lastModifiedDate = new Date(gitInfo.committerDate)

	return (
		<>
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
							<Link href="/profile">
								<a>My Profile</a>
							</Link>
						</li>

						<li>
							<Link href="/profile">
								<a>My Articles</a>
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

			<small className="block">
				<span>&copy; 2009-{(new Date()).getFullYear()} Trezy.com, LLC</span>
				{(typeof window !== 'undefined') && (
					<span>This page was last updated on {dateFormatter.format(new Date(gitInfo.committerDate))}. Note that this may be different from the last time the content of this page was published.</span>
				)}
			</small>
		</>
	)
}
