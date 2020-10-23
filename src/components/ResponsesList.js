// Module imports
import {
	isEmpty,
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Alert from 'components/Alert'
import Response from 'components/Response'
import useAuthSelector from 'store/selectors/useAuthSelector'
import useResponsesSelector from 'store/selectors/useResponsesSelector'





const Responses = props => {
	const {
		articleID,
		authorID,
	} = props
	const auth = useAuthSelector()
	const responses = useResponsesSelector()
	const collections = []

	if (articleID) {
		collections.push({
			collection: 'responses',
			orderBy: ['publishedAt', 'asc'],
			where: [
				['articleID', '==', articleID],
				['isSpam', '==', false],
				['isPendingAkismetVerification', '==', false],
				['isPendingHumanVerification', '==', false],
			],
		})

		if (!isEmpty(auth)) {
			collections.push({
				collection: 'responses',
				orderBy: ['publishedAt', 'asc'],
				storeAs: 'responsesPendingAkismetVerification',
				where: [
					['articleID', '==', articleID],
					['authorID', '==', auth.uid],
					['isPendingAkismetVerification', '==', true],
				],
			})

			collections.push({
				collection: 'responses',
				orderBy: ['publishedAt', 'asc'],
				storeAs: 'responsesPendingHumanVerification',
				where: [
					['articleID', '==', articleID],
					['authorID', '==', auth.uid],
					['isPendingHumanVerification', '==', true],
				],
			})
		}
	} else if (authorID && !isEmpty(auth)) {
		collections.push({
			collection: 'responses',
			orderBy: ['publishedAt', 'asc'],
			where: ['authorID', '==', authorID],
		})
	}

	useFirestoreConnect(collections)

	return (
		<div className="responses">
			{articleID && (
				<>
					{(isLoaded(responses) && isEmpty(responses) && isEmpty(auth)) && (
						<Alert type="informational">
							No responses... yet. <span aria-label="Eyes emoji" role="img">👀</span>
						</Alert>
					)}

					{(isLoaded(responses) && isEmpty(responses) && !isEmpty(auth)) && (
						<Alert type="informational">
							It doesn't look like there are any responses yet... Go ahead a slap a big old <strong>First!</strong> in that box! <span aria-label="Zany face emoji" role="img">🤪</span>
						</Alert>
					)}
				</>
			)}

			{(authorID && isLoaded(responses) && isEmpty(responses)) && (
				<Alert type="informational">
					You haven't posted any responses yet! <span aria-label="Sobbing face emoji" role="img">😭</span>
				</Alert>
			)}

			{(isLoaded(responses) && !isEmpty(responses)) && (
				<ol>
					{responses.map(response => (
						<li key={response.id}>
							<Response {...response} />
						</li>
					))}
				</ol>
			)}
		</div>
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
