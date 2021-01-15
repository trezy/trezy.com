// Module imports
import React from 'react'
import moment from 'moment'





// Local imports
import PageWrapper from 'components/PageWrapper'





export default function Version(props) {
	const {
		builtAt,
		environment,
		repo,
	} = props

	const authorLink = `https://github.com/${repo.commit.author.username}`
	const ownerLink = `https://github.com/${repo.owner}`
	const repoLink = `${ownerLink}/${repo.slug}`
	const commitLink = `${repoLink}/commit/${repo.commit.hash}`

	return (
		<PageWrapper title="Version Information">
			<section className="block">
				<header>
					<h3>Environment</h3>
				</header>

				<dl>
					<dt>Node Version</dt>
					<dd>v{environment.node.version}</dd>

					<dt>Next.js Version</dt>
					<dd>v{environment.next.version}</dd>

					<dt>Platform</dt>
					<dd style={{ textTransform: 'capitalize' }}>{environment.platform}</dd>

					{Boolean(environment.deploymentType) && (
						<>
							<dt>Deployment Type</dt>
							<dd style={{ textTransform: 'capitalize' }}>{environment.deploymentType}</dd>
						</>
					)}

					{Boolean(environment.region) && (
						<>
							<dt>Region</dt>
							<dd>{environment.region}</dd>
						</>
					)}

					<dt>Built</dt>
					<dd>{(new Date(builtAt)).toString()}</dd>
				</dl>
			</section>

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
		</PageWrapper>
	)
}

export async function getStaticProps() {
	const [
		fs,
		git,
		gitRev,
		path,
		{ promisify },
		yaml,
	] = await Promise.all([
		import('fs'),
		import('isomorphic-git'),
		import('git-rev-promises'),
		import('path'),
		import('util'),
		import('yaml'),
	])

	const [,
		yarnVersion = '',
	] = (/yarn\/(v?\d+\.\d+\.\d+)/.exec(process.env.npm_config_user_agent || '') || [])

	const repoLink = `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`

	const asyncReadFile = promisify(fs.readFile)
	const yarnLockPath = path.resolve(process.cwd(), 'yarn.lock')
	const lockfile = await asyncReadFile(yarnLockPath, 'utf8')
	const dependencies = yaml.parse(lockfile)

	const nextDependencyKey = Object
		.keys(dependencies)
		.find(dependency => /^next@.*:.*\d+\.\d+\.\d+$/iu.exec(dependency))
	const nextVersion = dependencies[nextDependencyKey]?.version

	const [
		gitBranch,
		gitCommitHash,
		gitCommitShortHash,
		gitCommitMessage,
	] = await Promise.all([
		gitRev.branch(),
		gitRev.long(),
		gitRev.short(),
		gitRev.message(),
	])
	const [
		[{
			commit: {
				author: {
					name: gitCommitAuthorName,
				}
			},
		}]
	] = await Promise.all([
		await git.log({
			depth: 1,
			dir: process.cwd(),
			fs,
		}),
	])

	return {
		props: {
			builtAt: Date.now(),
			environment: {
				dependencies,
				deploymentType: process.env.VERCEL_ENV || '',
				next: { version: nextVersion },
				node: { version: process.version.replace(/^v/iu, '') },
				platform: process.platform,
				region: process.env.VERCEL_REGION || '',
			},
			repo: {
				branch: gitBranch,
				commit: {
					author: {
						name: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || gitCommitAuthorName,
						username: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || '',
					},
					hash: gitCommitHash,
					shortHash: gitCommitShortHash,
					message: gitCommitMessage,
				},
				owner: process.env.VERCEL_GIT_REPO_OWNER || '',
				slug: process.env.VERCEL_GIT_REPO_SLUG || '',
			},
		},
	}
}
