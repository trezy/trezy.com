// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import { getFirestore } from 'redux-firestore'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import useCurrentUserIDSelector from '../store/selectors/useCurrentUserIDSelector'





// Local constants
const PUBLISHED_MESSAGE_TIMEOUT = 5000





const ResponseForm = props => {
  const firestore = getFirestore()
  const formElement = useRef(null)
  const inputElement = useRef(null)
  const { articleID } = props
  const [body, setBody] = useState('')
  const [bodyHasChanged, setBodyHasChanged] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const currentUserID = useCurrentUserIDSelector()

  const handleChange = ({ target: { value } }) => {
    if (!bodyHasChanged) {
      setBodyHasChanged(true)
    }

    setBody(value)
  }

  const handleFormClick = ({ target }) => {
    if (target === formElement.current) {
      inputElement.current.focus()
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setIsPublishing(true)

    const ipResponse = await fetch('https://api.ipify.org/?format=json')
    const { ip } = await ipResponse.json()

    const now = firestore.Timestamp.now()
    const serializedResponse = {
      articleID,
      authorID: currentUserID,
      body,
      createdAt: now,
      isPendingAkismetVerification: true,
      isPendingHumanVerification: false,
      isSpam: false,
      publishedAt: now,
      spamCheck: {
        ip,
        useragent: navigator.userAgent,
      },
      updatedAt: now,
    }

    const { id } = await firestore.add({
      collection: 'responses',
    }, serializedResponse)

    const responseElement = document.querySelector(`[id="${id}"]`)

    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: responseElement.offsetTop,
    })

    setIsPublishing(false)
    setIsPublished(true)
  }

  useEffect(() => {
    if (isPublished) {
      setBody('')
      setBodyHasChanged(false)
      setTimeout(() => setIsPublished(false), PUBLISHED_MESSAGE_TIMEOUT)
    }
  }, [isPublished])

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <form
        className="response-form"
        onClick={handleFormClick}
        onSubmit={handleSubmit}
        ref={formElement}>
        <fieldset>
          <textarea
            disabled={isPublishing || isPublished}
            onChange={handleChange}
            placeholder="Write a response..."
            ref={inputElement}
            value={body} />
        </fieldset>

        <footer
          className={classnames({
            'pointer-events-off': !body,
          })}
          data-animate
          data-animation={classnames({
            'fade-out-to-top-small': bodyHasChanged && !body,
            'fade-in-from-top-small': !bodyHasChanged || body,
          })}
          data-animation-duration="0.5s"
          data-animation-play-state={classnames({
            running: bodyHasChanged,
            paused: !bodyHasChanged,
          })}>
          <menu type="toolbar">
            <button
              className="primary"
              disabled={!body || isPublishing || isPublished}
              type="submit">
              Publish
            </button>
          </menu>
        </footer>

        {isPublished && (
          <div
            className="published-message"
            data-animate>
            <div>Published!</div>
          </div>
        )}
      </form>
    </>
  )
}

ResponseForm.propTypes = {
  articleID: PropTypes.string.isRequired,
}





export default ResponseForm
