// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import ResponseForm from 'components/ResponseForm'
import ResponsesList from 'components/ResponsesList'





const Responses = props => {
	const { articleID } = props

	return (
		<aside className="block responses-container">
			<h3>Responses</h3>

			<div>
				<ResponsesList {...props} />

				<ResponseForm articleID={articleID} />
			</div>
		</aside>
	)
}

Responses.defaultProps = {
	articleID: null,
	authorID: null,
}

Responses.propTypes = {
	articleID: PropTypes.string,
	authorID: PropTypes.string,
}





export default Responses
