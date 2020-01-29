// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getFirestore } from 'redux-firestore'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import articleDefaults from '../../../../models/article'
import PageWrapper from '../../../../components/PageWrapper'
import RequireAuthentication from '../../../../components/RequireAuthentication'





const BlogEditor = ({ id }) => {
  const firestore = getFirestore()
  const Router = useRouter()

  useFirestoreConnect([
    {
      collection: 'articles',
      doc: id,
    },
  ])

  const article = useSelector(state => state.firestore.data.articles?.[id]) || { ...articleDefaults }
  const { uid: currentUserID } = useSelector(state => state.firebase.auth)
  const { isDraft } = article

  const [body, setBody] = useState(article.body)
  const [subtitle, setSubtitle] = useState(article.subtitle)
  const [synopsis, setSynopsis] = useState(article.synopsis)
  const [isUpdating, setIsUpdating] = useState(false)
  const [title, setTitle] = useState(article.title)

  const saveArticle = async (publish = false) => {
    setIsUpdating(true)

    const now = firestore.Timestamp.fromDate(moment().toDate())
    const serializedArticle = {
      ...article,
      authorID: article.authorID || currentUserID,
      body,
      subtitle,
      synopsis,
      title,
    }

    serializedArticle.updatedAt = now

    if (publish) {
      serializedArticle.isDraft = false
    }

    if (id === 'new') {
      serializedArticle.createdAt = now
      serializedArticle.id = uuid()
    }

    await firestore.set({ collection: 'articles', doc: serializedArticle.id }, serializedArticle)

    if (id === 'new') {
      const href = '/dashboard/blog/edit/[id]'
      const as = `/dashboard/blog/edit/${serializedArticle.id}`
      const options = { shallow: true }

      Router.replace(href, as, options)
    }

    setIsUpdating(false)
  }

  useEffect(() => {
    const bodyHasChanged = body && (body !== article.body)
    const subtitleHasChanged = subtitle && (subtitle !== article.subtitle)
    const titleHasChanged = title && (title !== article.title)

    if (!bodyHasChanged && !subtitleHasChanged && !titleHasChanged) {
      setBody(article.body)
      setSubtitle(article.subtitle)
      setTitle(article.title)
    }
  }, [article])

  const isLoading = !isLoaded(article)

  return (
    <PageWrapper title={`Editing Article: ${title}`}>
      <RequireAuthentication>
        <section>
          <header>
            <h2>
              <input
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setTitle(value)}
                placeholder="Title"
                value={title} />
            </h2>
          </header>

          <form onSubmit={event => event.preventDefault()}>
            <fieldset>
              <input
                aria-label="Subtitle"
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setSubtitle(value)}
                placeholder="Subtitle"
                value={subtitle} />
            </fieldset>

            <fieldset>
              <input
                aria-label="Synopsis"
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setSynopsis(value)}
                placeholder="Synopsis"
                value={synopsis} />
            </fieldset>

            <fieldset>
              <textarea
                aria-label="Body"
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setBody(value)}
                placeholder="Body"
                value={body} />
            </fieldset>

            <menu type="toolbar">
              <button
                className="primary"
                disabled={isLoading || isUpdating}
                onClick={() => saveArticle()}
                type="submit">
                Save
              </button>

              {isDraft && (
                <button
                  className="primary"
                  disabled={isLoading || isUpdating}
                  onClick={() => saveArticle(true)}
                  type="submit">
                  Publish
                </button>
              )}

              {isUpdating && (
                <>
                  <FontAwesomeIcon
                    icon="spinner"
                    pulse />
                  Updating...
                </>
              )}
            </menu>
          </form>
        </section>
      </RequireAuthentication>
    </PageWrapper>
  )
}

BlogEditor.getInitialProps = async ({ query }) => {
  const firestore = getFirestore()

  await firestore.get({
    collection: 'articles',
    doc: query.id,
  })

  return {
    id: query.id,
  }
}

BlogEditor.propTypes = {
  id: PropTypes.string.isRequired,
}





export default BlogEditor
