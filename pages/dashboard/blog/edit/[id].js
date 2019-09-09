// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Component imports
import { actions } from '../../../../store'
import articleDefaults from '../../../../models/article'
import getArticle from '../../../../store/selectors/getArticleSelector'
import PageWrapper from '../../../../components/PageWrapper'
import requireAuthentication from '../../../../components/requireAuthentication'





const BlogEditor = ({ query: { id } }) => {
  const article = useSelector(getArticle(id)) || { ...articleDefaults }
  const dispatch = useDispatch()
  const isDraft = !article.publishedAt

  const [body, setBody] = useState(article.body)
  const [subtitle, setSubtitle] = useState(article.subtitle)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [title, setTitle] = useState(article.title)

  const saveArticle = async (publish = false) => {
    setIsUpdating(true)

    const newArticle = await dispatch(actions.saveArticle({
      ...article,
      body,
      subtitle,
      title,
    }, publish))

    if (id === 'new') {
      Router.replace({
        pathname: `/dashboard/blog/edit/${newArticle.id}`,
        query: {
          destination: location.href.replace(location.origin, ''), // eslint-disable-line no-restricted-globals
        },
      }, { shallow: true })
    }

    setIsUpdating(false)
  }

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      await dispatch(actions.getArticle(id, true))
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    setBody(article.body)
    setSubtitle(article.subtitle)
    setTitle(article.title)
  }, [article])

  return (
    <PageWrapper title={`Editing Article: ${title}`}>
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
    </PageWrapper>
  )
}

BlogEditor.propTypes = {
  query: PropTypes.object.isRequired,
}





export default requireAuthentication(BlogEditor)
