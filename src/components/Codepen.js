// Module imports
import {
	memo,
	useEffect,
} from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'





const Codepen = memo(props => {
	const {
		defaultTabs = ['result'],
		height = 300,
		id,
	} = props

	useEffect(() => {
		window.__CPEmbed()
	}, [])

	return (
		<div>
			<Head>
				<script
					async
					key={'codepen-embed'}
					src={'https://static.codepen.io/assets/embed/ei.js'} />
			</Head>

			<p
				className={'codepen'}
				data-height={height}
				data-theme-id={'2296'}
				data-default-tab={defaultTabs.join(',')}
				data-slug-hash={id} />
		</div>
	)
})

Codepen.propTypes = {
	defaultTabs: PropTypes.array,
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	id: PropTypes.string.isRequired,
}





export default Codepen
