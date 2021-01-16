// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import Fuse from 'fuse.js'





// Local imports
import { DependencyList } from './DependencyList'
import { getDependencyNameFromMatchers } from './helpers/getDependencyNameFromMatchers'
import Input from 'components/Input'





// Local constants
const FUSE_OPTIONS = {
	keys: ['name'],
}





export function Dependencies(props) {
	const {
		environment,
	} = props
	const fuse = useRef(new Fuse([], FUSE_OPTIONS))
	const [filteredDependencies, setFilteredDependencies] = useState(fuse.current.search(''))
	const [query, setQuery] = useState('')
	const [isLoaded, setIsLoaded] = useState(false)

	const handleQueryChange = useCallback(event => {
		const { value } = event.target
		setQuery(value)

		if (value) {
			setFilteredDependencies(fuse.current.search(value || '*'))
		}
	}, [
		setFilteredDependencies,
		setQuery,
	])

	useEffect(() => {
		const dependencyCollection = Object
			.entries(environment.dependencies)
			.map(([dependencyMatcher, item]) => ({
				key: dependencyMatcher,
				name: getDependencyNameFromMatchers(dependencyMatcher),
				item,
			}))
		fuse.current.setCollection(dependencyCollection)
		setIsLoaded(true)
	}, [])

	return (
		<section className="block">
			<header>
				<h3>Dependencies</h3>
			</header>

			<fieldset>
				<Input
					disabled={!isLoaded}
					onChange={handleQueryChange}
					placeholder={isLoaded ? 'Type a dependency name to filter the list' : 'Loading search...'}
					type="search"
					value={query} />
			</fieldset>

			<DependencyList
				dependencies={Boolean(query) ? filteredDependencies : fuse.current._docs}
				isFiltered={Boolean(query)} />
		</section>
	)
}
