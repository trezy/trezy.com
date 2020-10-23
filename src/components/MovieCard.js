// Module imports
import languageTags from 'language-tags'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'





const MovieCard = props => {
	const {
		backdropPath,
		genreIDs,
		originalLanguage,
		originalTitle,
		overview,
		posterPath,
		releaseDate,
		showGenres,
		title,
		voteAverage,
		voteCount,
	} = props
	const cardStyle = {}

	if (backdropPath) {
		cardStyle.backgroundImage = `
			radial-gradient(
				ellipse,
				rgba(255, 255, 255, 0.7),
				rgba(255, 255, 255, 1)
			),
			url(https://image.tmdb.org/t/p/w1280${backdropPath})
		`
	}

	return (
		<div
			className="card movie"
			style={cardStyle}>
			{posterPath && (
				<img
					alt={`Movie poster for ${title}`}
					src={`https://image.tmdb.org/t/p/w500${posterPath}`} />
			)}

			<header>
				<span className="title">{title}</span>

				{(originalTitle !== title) && (
					<sub className="original-title">
						Originally "{originalTitle}"
					</sub>
				)}
			</header>

			<div className="content">
				{showGenres && (
					<span className="genres">
						<strong>Genres: </strong>

						<ul className="inline">
							{genreIDs.map(genreID => (
								<li
									className="badge"
									key={genreID}>
									{genreID}
								</li>
							))}
						</ul>
					</span>
				)}

				{overview && (
					<p>
						<strong>Overview:</strong><br />
						{overview}
					</p>
				)}

				<p>
					<strong>Rating: </strong>
					{/* eslint-disable-next-line no-magic-numbers */}
					{voteAverage * 10}% ({voteCount} votes)
				</p>

				<p>
					<strong>Released: </strong>
					{moment(releaseDate).format('D MMMM, Y')}
				</p>

				<p>
					<strong>Original Language: </strong>
					{languageTags.language(originalLanguage).descriptions()[0]}
				</p>

				{/* <pre>
					{JSON.stringify(props, null, 2)}
				</pre> */}
			</div>
		</div>
	)
}

MovieCard.defaultProps = {
	backdropPath: null,
	posterPath: null,
	showGenres: true,
}

MovieCard.propTypes = {
	backdropPath: PropTypes.string,
	genreIDs: PropTypes.array.isRequired,
	originalLanguage: PropTypes.string.isRequired,
	originalTitle: PropTypes.string.isRequired,
	overview: PropTypes.string.isRequired,
	posterPath: PropTypes.string,
	releaseDate: PropTypes.string.isRequired,
	showGenres: PropTypes.bool,
	title: PropTypes.string.isRequired,
	voteAverage: PropTypes.number.isRequired,
	voteCount: PropTypes.number.isRequired,
}





export default MovieCard
