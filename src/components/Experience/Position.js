// Module imports
import PropTypes from 'prop-types'





// Local imports
import MarkdownRenderer from '../MarkdownRenderer.js'
import { DateTime } from '../DateTime.js'





// Constants
const DEFAULT_TIME_PROPS = {
	dateFormat: {
		month: 'long',
		year: 'numeric',
	},
	showTime: false,
}





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
						<DateTime
							{...DEFAULT_TIME_PROPS}
							value={startDate} />

						{!endDate && ' - Present'}

						{(endDate && (startDate !== endDate)) && (
							<>
								{' - '}
								<DateTime
									{...DEFAULT_TIME_PROPS}
									value={endDate} />
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
	endDate: null,
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
