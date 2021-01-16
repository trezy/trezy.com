// Module imports
import {
	useCallback,
	useState,
} from 'react'





// Local imports
import { DependencyCard } from './DependencyCard'
import { Pagination } from 'components/Pagination'





export function DependencyList(props) {
	const {
		dependencies,
		isFiltered,
	} = props
	const [currentPage, setCurrentPage] = useState(1)

	const handlePageChange = useCallback(pageNumber => {
		setCurrentPage(+pageNumber)
	}, [setCurrentPage])

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
	})

	const sliceStart = (currentPage - 1) * 10

	return (
		<>
			<ul>
				{dependencies.slice(sliceStart, sliceStart + 10).reduce(reducer, [])}
			</ul>

			<Pagination
				currentPage={currentPage}
				onPageChange={handlePageChange}
				totalPageCount={Math.ceil(dependencies.length / 10)} />
		</>
	)
}
