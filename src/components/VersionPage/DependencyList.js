// Module imports
import {
	useCallback,
	useState,
} from 'react'





// Local imports
import { DependencyCard } from './DependencyCard'





export function DependencyList(props) {
	const {
		dependencies,
		isFiltered,
	} = props

	const reducer = useCallback((accumulator, dependency) => {
		let dependencyData = isFiltered ? dependency.item : dependency

		if (dependencyData.key !== '__metadata') {
			accumulator.push(
				<li key={dependencyData.key}>
					<DependencyCard
						name={dependencyData.name}
						matchers={dependencyData.key}
						details={dependencyData.item} />
				</li>
			)
		}

		return accumulator
	}, [
		dependencies,
		isFiltered,
	])

	return (
		<>
			<ul>
				{dependencies.reduce(reducer, [])}
			</ul>
		</>
	)
}
