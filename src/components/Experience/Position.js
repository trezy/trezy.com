// Module imports
import PropTypes from 'prop-types'





// Local imports
import MarkdownRenderer from 'components/MarkdownRenderer'





function Position(props) {
	const {
		accomplishments,
		endDate,
		startDate,
		tech,
		title,
	} = props

	let { description } = props

	if (accomplishments?.length) {
		if (description) {
			description += '\n\n'
		}

		description += `**Accomplishments:**\n* ${accomplishments.join('\n* ')}`
	}

	if (tech?.length) {
		if (description) {
			description += '\n\n'
		}

		description += `**Tech:** ${tech.join(', ')}`
	}

	return (
		<li>
			<h4>{title}</h4>

			<div className={'meta'}>
				<div className={'meta-bar'}>
					<span>
						<time>{startDate}</time>
						{(startDate !== endDate) && (
							<>
								{' - '}
								<time>{endDate}</time>
							</>
						)}
					</span>
				</div>
			</div>

			<MarkdownRenderer children={description} />
		</li>
	)
}

Position.defaultProps = {
	accomplishments: null,
	description: '',
	endDate: 'Present',
	tech: null,
}

Position.propTypes = {
	accomplishments: PropTypes.arrayOf(PropTypes.string),
	description: PropTypes.string,
	endDate: PropTypes.string,
	startDate: PropTypes.string.isRequired,
	tech: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string.isRequired,
}

export default Position
