const getMoviesSearchResults = ({ movies, moviesSearchResults }) => ({
	...moviesSearchResults,
	movies: moviesSearchResults.movies.map(movieID => movies[movieID]),
})





export default getMoviesSearchResults
