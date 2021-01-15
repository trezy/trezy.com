export function Git(props) {
	const {
		repo,
	} = props

	const authorLink = `https://github.com/${repo.commit.author.username}`
	const ownerLink = `https://github.com/${repo.owner}`
	const repoLink = `${ownerLink}/${repo.slug}`
	const commitLink = `${repoLink}/commit/${repo.commit.hash}`

	return (
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
					<br />
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


					<small>
						Branch: {repo.branch}
					</small>
				</dd>
			</dl>
		</section>
	)
}
