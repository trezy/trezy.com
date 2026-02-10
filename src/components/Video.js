// Module imports
import PropTypes from 'prop-types'
import { useMemo } from 'react'





export function Video(props) {
	const {
		height,
		isAutoplay = false,
		isLooping = false,
		isMuted = false,
		poster = null,
		preload = 'metadata',
		showControls = true,
		sources,
		width,
	} = props

	const mappedSources = useMemo(() => {
		return sources.map(source => {
			return (
				<source
					key={source.url}
					src={source.url}
					type={source.contentType} />
			)
		})
	}, [sources])

	return (
		<video
			autoplay={isAutoplay}
			controls={showControls}
			height={height}
			loop={isLooping}
			muted={isMuted}
			preload={preload}
			poster={poster}
			width={width}>
			{mappedSources}

			{'Sorry, your browser doesn\'t support embedded videos.'}
		</video>
	)
}

Video.propTypes = {
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
	isAutoplay: PropTypes.bool,
	isLooping: PropTypes.bool,
	isMuted: PropTypes.bool,
	preload: PropTypes.oneOf([
		'auto',
		'metadata',
		'none',
	]),
	poster: PropTypes.string,
	showControls: PropTypes.bool,
	sources: PropTypes.arrayOf(PropTypes.shape({
		contentType: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
	})).isRequired,
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
}
