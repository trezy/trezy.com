// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Alert from './Alert'
import Response from './Response'
import ResponseForm from './ResponseForm'
import useAuthSelector from '../store/selectors/useAuthSelector'
import useResponsesSelector from '../store/selectors/useResponsesSelector'





const Responses = props => {
  const { articleID } = props
  const auth = useAuthSelector()
  const responses = useResponsesSelector()
  const collections = [
    {
      collection: 'responses',
      orderBy: ['publishedAt', 'asc'],
      where: [
        ['articleID', '==', articleID],
        ['isSpam', '==', false],
        ['isPendingAkismetVerification', '==', false],
        ['isPendingHumanVerification', '==', false],
      ],
    },
  ]

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

  useFirestoreConnect(collections)

  return (
    <aside className="responses-container">
      <hr />

      <h3>Responses</h3>

      <div>
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

        {(isLoaded(responses) && !isEmpty(responses)) && (
          <ol className="responses">
            {responses.map(response => (
              <li key={response.id}>
                <Response {...response} />
              </li>
            ))}
          </ol>
        )}

        <ResponseForm articleID={articleID} />
      </div>
    </aside>
  )
}

Responses.propTypes = {
  articleID: PropTypes.string.isRequired,
}





export default Responses
