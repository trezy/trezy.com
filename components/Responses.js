// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Response from './Response'
import ResponseForm from './ResponseForm'
import useAuthSelector from '../store/selectors/useAuthSelector'
import useResponsesSelector from '../store/selectors/useResponsesSelector'





const Responses = props => {
  const { articleID } = props
  const auth = useAuthSelector()
  const responses = useResponsesSelector()

  useFirestoreConnect([
    {
      collection: 'responses',
      orderBy: ['publishedAt', 'asc'],
      where: ['articleID', '==', articleID],
    },
  ])

  return (
    <aside className="responses">
      <hr />

      <h2>Responses</h2>

      <div>
        {(isLoaded(responses) && !isEmpty(responses)) && (
          <ol>
            {responses.map(response => (
              <li key={response.id}>
                <Response {...response} />
              </li>
            ))}
          </ol>
        )}

        {(isLoaded(auth) && !isEmpty(auth)) && (
          <ResponseForm articleID={articleID} />
        )}
      </div>
    </aside>
  )
}

Responses.propTypes = {
  articleID: PropTypes.string.isRequired,
}





export default Responses
