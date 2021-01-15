// Local imports
import { VersionPage } from 'components/VersionPage'





export default function Version(props) {
	return (
		<VersionPage {...props} />
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
