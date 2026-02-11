export function Git(props) {
	const { repo } = props;

	const authorLink = `https://github.com/${repo.commit.author.username}`;
	const ownerLink = `https://github.com/${repo.owner}`;
	const repoLink = `${ownerLink}/${repo.slug}`;
	const commitLink = `${repoLink}/commit/${repo.commit.hash}`;

	return (
		<section className="block">
			<header>
				<h3>Git</h3>
			</header>

			<dl
				style={{
					display: "grid",
					gridTemplateColumns: "auto 1fr",
				}}
			>
				<dt>Commit</dt>
				<dd>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							whiteSpace: "pre-wrap",
						}}
					>
						<a href={commitLink}>{repo.commit.shortHash}</a>
						{repo.commit.message}
					</div>
				</dd>

				<dd>
					{Boolean(repo.commit.author.username) && (
						<small>
							{"Authored by "}
							<a href={authorLink}>
								{repo.commit.author.name || repo.commit.author.username}
							</a>
						</small>
					)}
				</dd>

				<dt>Repo</dt>
				<dd>
					{repo.owner && repo.slug && (
						<>
							<a href={ownerLink}>{repo.owner}</a>
							{"/"}
							<a href={repoLink}>{repo.slug}</a>
							<br />
						</>
					)}

					{(!repo.owner || !repo.slug) && (
						<>
							Unknown
							<br />
						</>
					)}
				</dd>
				<dd>
					<small>Branch: {repo.branch}</small>
				</dd>
			</dl>
		</section>
	);
}
