// Local imports
import jokes from 'api/data/jokes.json'





const getJokes = query => {
	const krParams = [
		'la',
		'lm',
		'ns',
		'si',
		'so',
		'ta',
	]

	let filteredJokes = jokes

	krParams.forEach(param => {
		const filter = query[param]

		if (filter) {
			filteredJokes = filteredJokes.filter(joke => joke.kr[param] === filter)
		}
	})

	return filteredJokes
}





export default getJokes
