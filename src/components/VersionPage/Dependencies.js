// Module imports
import {
	Fragment,
} from 'react'





export function Dependencies(props) {
	const {
		environment,
	} = props

	return (
		<section className="block">
			<header>
				<h3>Dependencies</h3>
			</header>

			<dl>
				{Object.entries(environment.dependencies).map(([dependency, details]) => {
					if (dependency === '__metadata') {
						return null
					}
					const [, dependencyName] = /^(@?[-\/\w\d]+)@?/mu.exec(dependency)
					const dependencyMatchers = dependency.split(', ')

					return (
						<Fragment key={dependency}>
							<dt className="full-width">
								{dependencyName}
							</dt>

							{Boolean(dependencyMatchers) && (
								<dd>
									<ul>
										{dependencyMatchers.map((item, index) => (
											<li key={index}>
												{item}
											</li>
										))}
									</ul>
								</dd>
							)}

							<dd><pre>{JSON.stringify(details, null, 2)}</pre></dd>
						</Fragment>
					)
				})}
			</dl>
		</section>
	)
}
