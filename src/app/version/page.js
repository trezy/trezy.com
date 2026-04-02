// Local imports
import { VersionPage } from 'components/VersionPage'

export const dynamic = 'force-dynamic'

export const metadata = {
	title: 'Version',
}

export default async function Version() {
	const [
		fs,
		git,
		gitRev,
		path,
		{ promisify },
	] = await Promise.all([
		import('fs'),
		import('isomorphic-git'),
		import('git-rev-promises'),
		import('path'),
		import('util'),
	])

	const asyncReadFile = promisify(fs.readFile)
	const bunLockPath = path.resolve(process.cwd(), 'bun.lock')
	const lockfile = await asyncReadFile(bunLockPath, 'utf8')
	const lockfileData = JSON.parse(lockfile.replace(/,(\s*[}\]])/g, '$1'))

	const dependencies = Object.fromEntries(
		Object.entries(lockfileData.packages).map(([name, entry]) => {
			const [nameAtVersion, , metadata] = entry
			const version = nameAtVersion.slice(name.length + 1)
			return [name, { version, resolution: nameAtVersion, ...metadata }]
		})
	)

	const nextVersion = dependencies['next']?.version

	const [
		gitBranch,
		gitCommitHash,
		gitCommitShortHash,
	] = await Promise.all([
		gitRev.branch(),
		gitRev.long(),
		gitRev.short(),
	])
	const [
		[{
			commit: {
				author: {
					name: gitCommitAuthorName,
				},
				message: gitCommitMessage,
			},
		}]
	] = await Promise.all([
		await git.log({
			depth: 1,
			dir: process.cwd(),
			fs,
		}),
	])

	const props = {
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
	}

	return <VersionPage {...props} />
}
