// Module imports
import { useRouter } from 'next/router'
import Link from 'next/link'





// Local imports
import ExternalLink from 'components/ExternalLink'





export function Git(props) {
	const {
		repo,
	} = props
	const { locale } = useRouter()
	const dateFormatter = new Intl.DateTimeFormat(locale, {
		dateStyle: 'full',
		timeStyle: 'short',
	})

	const authorLink = `https://github.com/${repo.commit.author.username}`
	const ownerLink = `https://github.com/${repo.owner}`
	const repoLink = `${ownerLink}/${repo.slug}`
	const commitLink = `${repoLink}/commit/${repo.commit.hash}`

	return (
		<>
			<section className="block">
				<header>
					<h3>Git</h3>
				</header>

				<dl>
					<dt>Commit</dt>
					<dd>
						<a href={commitLink}>{repo.commit.shortHash}</a>
						{': '}
						{repo.commit.message}
					</dd>

					<dd>
						{Boolean(repo.commit.author.username) && (
							<small>
								{'Authored by '}
								<a href={authorLink}>{repo.commit.author.name || repo.commit.author.username}</a>
							</small>
						)}
					</dd>

					<dt>Repo</dt>
					<dd>
						{(repo.owner && repo.slug) && (
							<>
								<a href={ownerLink}>{repo.owner}</a>
								{'/'}
								<a href={repoLink}>{repo.slug}</a>
								<br />
							</>
						)}

						{(!repo.owner || !repo.slug) && (
							<>Unknown<br /></>
						)}
					</dd>
					<dd>
						<small>
							Branch: {repo.branch}
						</small>
					</dd>
				</dl>
			</section>

			<section className="block">
				<header>
					<h3>Pages</h3>
				</header>

				<dl>
					{Object.entries(process.env.gitInfo.pages).map(([route, info]) => (
						<>
							<dt className="full-width">
								<Link href={route}>
									<a>
										<code>{route}</code>
									</a>
								</Link>
							</dt>

							<dd className="full-width">
								<dl>
									<dt>Author</dt>
									<dd>{info.author.name} &lt;{info.author.email}&gt;</dd>

									<dt>Authored At</dt>
									<dd>{dateFormatter.format(new Date(info.authorDate))}</dd>

									<dt>Commit</dt>
									<dd>{info.commitMessage}</dd>
									<dd>
										<ExternalLink href={`https://github.com/trezy-studios/trezy.com/commit/${info.commitHash}`}>
											<small>{info.commitHash}</small>
										</ExternalLink>
									</dd>
								</dl>
							</dd>
						</>
					))}
				</dl>
			</section>
		</>
	)
}
