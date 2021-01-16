// Module imports
import { Fragment } from 'react'





export function DependencyCard(props) {
	const {
		name,
		matchers,
		details,
	} = props

	return (
		<div className="card">
			<header>
				<span className="title">{name}</span>
			</header>

			<div className="content">
				<dl>
					<dt>Dependency Matchers</dt>
					{matchers.split(', ').map(item => (
						<dd key={item}>{item}</dd>
					))}

					<dt>Resolution</dt>
					<dd>{details.resolution}</dd>

					<dt>Version</dt>
					<dd>{details.version}</dd>

					{Boolean(details.dependencies) && (
						<>
							<dt className="full-width">Dependencies</dt>
							<dd className="full-width">
								<dl>
									{Object.entries(details.dependencies).map(([item, version]) => (
										<Fragment key={item}>
											<dt key={item}>
												{item}
												{Boolean(details.dependenciesMeta?.[item]?.optional) && ' (optional)'}
											</dt>

											<dd>{version}</dd>
										</Fragment>
									))}
								</dl>
							</dd>
						</>
					)}

					{Boolean(details.peerDependencies) && (
						<>
							<dt className="full-width">Peer Dependencies</dt>
							<dd className="full-width">
								<dl>
									{Object.entries(details.peerDependencies).map(([item, version]) => (
										<Fragment key={item}>
											<dt key={item}>
												{item}
												{Boolean(details.peerDependenciesMeta?.[item]?.optional) && ' (optional)'}
											</dt>

											<dd>{version}</dd>
										</Fragment>
									))}
								</dl>
							</dd>
						</>
					)}
				</dl>

				<pre style={{maxWidth: '100%', overflow: 'auto'}}>
					{(() => {
						const tempDetails = {...details}
						delete tempDetails.bin
						delete tempDetails.checksum
						delete tempDetails.dependencies
						delete tempDetails.dependenciesMeta
						delete tempDetails.languageName
						delete tempDetails.linkType
						delete tempDetails.peerDependencies
						delete tempDetails.peerDependenciesMeta
						delete tempDetails.resolution
						delete tempDetails.version

						if (Object.keys(tempDetails).length) {
							return `BLORPLAGER ${JSON.stringify(tempDetails, null, 2)}`
						}

						return null
					})()}
				</pre>
			</div>
		</div>
	)
}
