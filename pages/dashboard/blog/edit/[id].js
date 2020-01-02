// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  isLoaded,
  useFirebase,
  useFirebaseConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import PropTypes from 'prop-types'
import Router from 'next/router'
import uuid from 'uuid/v4'





// Component imports
import articleDefaults from '../../../../models/article'
import PageWrapper from '../../../../components/PageWrapper'
import RequireAuthentication from '../../../../components/RequireAuthentication'





const BlogEditor = ({ query: { id } }) => {
  const firebase = useFirebase()

  let collectionsToLoad = []

  if (id !== 'new') {
    collectionsToLoad = [
      {
        path: 'articles',
        queryParams: [id],
      },
      {
        path: 'drafts',
        queryParams: [id],
      },
    ]
  }

  useFirebaseConnect(collectionsToLoad)

  const article = useSelector(state => {
    let result = state.firebase.data.drafts?.[id]

    if (!result) {
      result = state.firebase.data.articles?.[id]
    }

    return result
  }) || { ...articleDefaults }

  const isDraft = !article.publishedAt

  const [body, setBody] = useState(article.body)
  const [subtitle, setSubtitle] = useState(article.subtitle)
  const [isUpdating, setIsUpdating] = useState(false)
  const [title, setTitle] = useState(article.title)

  const saveArticle = async (publish = false) => {
    setIsUpdating(true)

    const now = moment.utc().valueOf()
    const serializedArticle = {
      ...article,
      body,
      subtitle,
      title,
    }

    let collection = 'drafts'

    serializedArticle.updatedAt = now

    if (publish) {
      serializedArticle.publishedAt = now
    }

    if (publish || (!publish && article.publishedAt)) {
      collection = 'articles'
    }

    const newID = uuid()
    const promises = []

    if (id === 'new') {
      serializedArticle.createdAt = now
      serializedArticle.id = newID
      promises.push(firebase.ref(`/${collection}/${newID}`).set(serializedArticle))
    } else {
      promises.push(firebase.ref(`/${collection}/${id}`).update(serializedArticle))

      if (publish) {
        promises.push(firebase.ref(`/drafts/${id}`).remove())
      }
    }

    await Promise.all(promises)

    if (id === 'new') {
      Router.replace({
        pathname: `/dashboard/blog/edit/${(id === 'new') ? newID : id}`,
        query: {
          destination: location.href.replace(location.origin, ''), // eslint-disable-line no-restricted-globals
        },
      }, { shallow: true })
    }

    setIsUpdating(false)
  }

  useEffect(() => {
    setBody(article.body)
    setSubtitle(article.subtitle)
    setTitle(article.title)
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

BlogEditor.propTypes = {
  query: PropTypes.object.isRequired,
}





export default BlogEditor
