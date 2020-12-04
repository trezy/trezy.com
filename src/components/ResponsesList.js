// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { useAuth } from 'contexts/AuthContext'
import Alert from 'components/Alert'
import Response from 'components/Response'





const ResponsesList = props => {
	const { responses } = props
	const { user } = useAuth()

	// if (articleID) {
	// 	collections.push({
	// 		collection: 'responses',
	// 		orderBy: ['publishedAt', 'asc'],
	// 		where: [
	// 			['articleID', '==', articleID],
	// 			['isSpam', '==', false],
	// 			['isPendingAkismetVerification', '==', false],
	// 			['isPendingHumanVerification', '==', false],
	// 		],
	// 	})

	// 	if (!isEmpty(auth)) {
	// 		collections.push({
	// 			collection: 'responses',
	// 			orderBy: ['publishedAt', 'asc'],
	// 			storeAs: 'responsesPendingAkismetVerification',
	// 			where: [
	// 				['articleID', '==', articleID],
	// 				['authorID', '==', auth.uid],
	// 				['isPendingAkismetVerification', '==', true],
	// 			],
	// 		})

	// 		collections.push({
	// 			collection: 'responses',
	// 			orderBy: ['publishedAt', 'asc'],
	// 			storeAs: 'responsesPendingHumanVerification',
	// 			where: [
	// 				['articleID', '==', articleID],
	// 				['authorID', '==', auth.uid],
	// 				['isPendingHumanVerification', '==', true],
	// 			],
	// 		})
	// 	}
	// } else if (authorID && !isEmpty(auth)) {
	// 	collections.push({
	// 		collection: 'responses',
	// 		orderBy: ['publishedAt', 'asc'],
	// 		where: ['authorID', '==', authorID],
	// 	})
	// }

	return (
		<div className="responses">
			{(!responses?.length && !user) && (
				<Alert type="informational">
					No responses... yet. <span aria-label="Eyes emoji" role="img">👀</span>
				</Alert>
			)}

			{(!responses?.length && user) && (
				<Alert type="informational">
					It doesn't look like there are any responses yet... Go ahead a slap a big old <strong>First!</strong> in that box! <span aria-label="Zany face emoji" role="img">🤪</span>
				</Alert>
			)}

			{Boolean(responses?.length) && (
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

ResponsesList.defaultProps = {
	responses: null,
}

ResponsesList.propTypes = {
	responses: PropTypes.any,
}

export { ResponsesList }
