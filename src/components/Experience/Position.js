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

			<div className="meta">
				<span><time>{startDate}</time> - <time>{endDate || 'Present'}</time></span>
			</div>

			<MarkdownRenderer source={description} />
		</li>
	)
}

Position.defaultProps = {
	accomplishments: null,
}

Position.propTypes = {
	accomplishments: PropTypes.arrayOf(PropTypes.string),
	endDate: PropTypes.string.isRequired,
	startDate: PropTypes.string.isRequired,
	tech: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string.isRequired,
}

export default Position
