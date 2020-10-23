// Module imports
import React from 'react'





// Component imports
import MovieSearch from 'components/MovieSearch'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





export default function MovieList() {
	return (
		<PageWrapper title="Movie List">
			<RequireAuthentication>
				<section>
					<header>
						<h2>Movie Buddy</h2>
					</header>

					<MovieSearch />
				</section>
			</RequireAuthentication>
		</PageWrapper>
	)
}
