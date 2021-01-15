// Module imports
import React from 'react'
import moment from 'moment'





// Local imports
import PageWrapper from 'components/PageWrapper'





export default function Version(props) {
	const {
		builtAt,
		commitLink,
		nextVersion,
		nodeVersion,
		repoLink,
		yarnVersion,
	} = props

	return (
		<PageWrapper title="Version Information">
			<section className="hero">
				<dl>
					<dt>Built:</dt>
					<dd>{(new Date(builtAt)).toString()}</dd>

					<dt>Node Version:</dt>
					<dd>{nodeVersion}</dd>

					<dt>Yarn Version:</dt>
					<dd>{yarnVersion}</dd>

					<dt>Next.js Version:</dt>
					<dd>{nextVersion}</dd>

					<dt>Repo:</dt>
					<dd><a href={repoLink}>{repoLink}</a></dd>

					<dt>Commit:</dt>
					<dd><a href={commitLink}>{commitLink}</a></dd>
				</dl>
			</section>
		</PageWrapper>
	)
}

export async function getStaticProps() {
	const [, yarnVersion, nodeVersion, buildEnvironment] = (/yarn\/([\d\.]+) npm\/\? node\/v([\d\.]+ (.*))/.exec(process.env.npm_config_user_agent || '') || [])

	const repoLink = `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`

	return {
		props: {
			buildEnvironment,
			builtAt: Date.now(),
			commitLink: `${repoLink}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`,
			nextVersion: '?', //process.env.npm_package_dependencies_next,
			nodeVersion,
			repoLink,
			yarnVersion,
		},
	}
}
