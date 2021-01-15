// Module imports
export function Environment(props) {
	const {
		builtAt,
		environment,
	} = props

	return (
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
				<dd className="capitalize">{environment.platform}</dd>

				{Boolean(environment.deploymentType) && (
					<>
						<dt>Deployment Type</dt>
						<dd className="capitalize">{environment.deploymentType}</dd>
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
	)
}
