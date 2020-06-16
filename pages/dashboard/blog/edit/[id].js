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
import Button from '../../../../components/Button'
import createSlugFromTitleString from '../../../../helpers/createSlugFromTitleString'
import createTitleStringFromArticle from '../../../../helpers/createTitleStringFromArticle'
import MarkdownEditor from '../../../../components/MarkdownEditor'
import PageWrapper from '../../../../components/PageWrapper'
import RequireAuthentication from '../../../../components/RequireAuthentication'
import useClaimsSelector from '../../../../store/selectors/useClaimsSelector'
import useCurrentUserIDSelector from '../../../../store/selectors/useCurrentUserIDSelector'





const BlogEditor = ({ id }) => {
  const firestore = getFirestore()
  const Router = useRouter()
  const connections = []

  if (id !== 'new') {
    connections.push({
      collection: 'articles',
      doc: id,
    })
  }

  useFirestoreConnect(connections)

  const article = useSelector(state => state.firestore.data.articles?.[id]) || { ...articleDefaults }
  const claims = useClaimsSelector()
  const currentUserID = useCurrentUserIDSelector()
  const { isDraft } = article

  const [body, setBody] = useState(article.body || '')
  const [previewMode, setPreviewMode] = useState(false)
  const [subtitle, setSubtitle] = useState(article.subtitle || '')
  const [synopsis, setSynopsis] = useState(article.synopsis || '')
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

    if (article.createdAt) {
      serializedArticle.createdAt = firestore.Timestamp.fromMillis(article.createdAt.seconds * 1000)
    }

    serializedArticle.updatedAt = now
    serializedArticle.slug = createSlugFromTitleString(createTitleStringFromArticle(serializedArticle))

    if (article.publishedAt) {
      serializedArticle.publishedAt = firestore.Timestamp.fromMillis(article.publishedAt.seconds * 1000)
    }

    if (publish) {
      serializedArticle.isDraft = false
      serializedArticle.publishedAt = now
    }

    if (id === 'new') {
      serializedArticle.createdAt = now
      serializedArticle.id = uuid()
      serializedArticle.oldSlugs = []
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
    const synopsisHasChanged = synopsis && (synopsis !== article.synopsis)
    const subtitleHasChanged = subtitle && (subtitle !== article.subtitle)
    const titleHasChanged = title && (title !== article.title)

    if (!bodyHasChanged && !subtitleHasChanged && !synopsisHasChanged && !titleHasChanged) {
      setBody(article.body)
      setSynopsis(article.synopsis)
      setSubtitle(article.subtitle)
      setTitle(article.title)
    }
  }, [article])

  const isLoading = !isLoaded(article)
  const canPublish = claims['actions.article.publish']

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
                type="text"
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
                type="text"
                value={subtitle} />
            </fieldset>

            <fieldset>
              <MarkdownEditor
                aria-label="Synopsis"
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setSynopsis(value)}
                placeholder="Synopsis"
                previewMode={previewMode}
                value={synopsis} />
            </fieldset>

            <fieldset>
              <MarkdownEditor
                aria-label="Body"
                disabled={isLoading || isUpdating}
                onChange={({ target: { value } }) => setBody(value)}
                placeholder="Body"
                previewMode={previewMode}
                value={body} />
            </fieldset>

            <menu type="toolbar">
              <Button
                disabled={isLoading || isUpdating}
                onClick={() => setPreviewMode(!previewMode)}>
                Preview
              </Button>

              <Button
                className="primary"
                disabled={isLoading || isUpdating}
                onClick={() => saveArticle()}
                type="submit">
                Save
              </Button>

              {(isDraft && canPublish) && (
                <Button
                  className="primary"
                  disabled={isLoading || isUpdating}
                  onClick={() => saveArticle(true)}
                  type="submit">
                  Publish
                </Button>
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

BlogEditor.getInitialProps = ({ query: { id } }) => ({ id })

BlogEditor.propTypes = {
  id: PropTypes.string.isRequired,
}





export default BlogEditor
