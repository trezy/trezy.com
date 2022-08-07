// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





// Local imports
import { DependencyRow } from './DependencyRow.js'





export function DependencyTable(props) {
	const { dependencies } = props

	const mappedDependencies = useMemo(() => {
		const dependencyEntries = Object.entries(dependencies.dependencies)

		return dependencyEntries.map(([name, requiredVersion], index) => {
			return (
				<DependencyRow
					key={index}
					name={name}
					requiredVersion={requiredVersion} />
			)
		})
	}, [dependencies])

	return (
		<table className={'dependency-table'}>
			<thead>
				<tr>
					<th scope={'col'}>{'Dependency'}</th>
					<th scope={'col'}>{'Required'}</th>
					<th scope={'col'}>{'Latest'}</th>
				</tr>
			</thead>

			<tbody>
				{mappedDependencies}
			</tbody>
		</table>
	)
}

DependencyTable.propTypes = {
	dependencies: PropTypes.shape({
		dependencies: PropTypes.object,
		engines: PropTypes.object,
	}),
}
