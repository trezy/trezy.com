// Module imports
import React, {
	useEffect,
	useState,
} from 'react'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import { v4 as uuid } from 'uuid'





// Component imports
import { actions } from 'store'
import getMoviesSearchResultsSelector from 'store/selectors/getMoviesSearchResults'
import MovieCard from 'components/MovieCard'





/* eslint-disable jsx-a11y/control-has-associated-label */
const MovieSearch = () => {
	const dispatch = useDispatch()

	const [query, setQuery] = useState('')
	const [isSearching, setIsSearching] = useState('')

	const {
		movies,
		totalResults,
	} = useSelector(getMoviesSearchResultsSelector)

	const id = `movie-search-${uuid()}`

	useEffect(() => {
		if (query) {
			setIsSearching(true)

			const timeoutID = setTimeout(async () => {
				await dispatch(actions.findMovies(query))
				setIsSearching(false)
			}, 1000)

			return () => clearTimeout(timeoutID)
		}

		setIsSearching(false)

		return () => {}
	}, [query])

	return (
		<fieldset>
			<label htmlFor={id}>
				Search Movies
			</label>

			<input
				id={id}
				onChange={({ target: { value } }) => setQuery(value)}
				type="search"
				value={query} />

			{isSearching && (
				<div>Searching...</div>
			)}

			{(query && !isSearching) && (
				<>
					{query && (
						<div className="status">
							Currently displaying {movies.length} of
							{(totalResults >= 1000) && (
								<>... HOLY SHIT. THERE'S LITERALLY THOUSANDS. Refine your search, mang.</>
							)}
							{(totalResults < 1000) && (
								<> {totalResults} possibilities...</>
							)}
						</div>
					)}

					<ol
						className="results card-list"
						data-animation-sequential-delay>
						{movies.map(movie => (
							<li
								data-animate
								data-animation="fade-in-from-bottom"
								data-animation-duration="1s"
								key={movie.id}>
								<MovieCard
									showGenres={false}
									{...movie} />
							</li>
						))}
					</ol>
				</>
			)}
		</fieldset>
	)
}
/* eslint-enable */





export default MovieSearch
