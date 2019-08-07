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





// Component imports
import { actions } from '../../../store'
import { Router } from '../../../routes'
import articleDefaults from '../../../models/article'
import getArticle from '../../../store/selectors/getArticleSelector'
import PageWrapper from '../../../components/PageWrapper'
import requireAuthentication from '../../../components/requireAuthentication'





const BlogEditor = ({ query: { id } }) => {
  const article = {
    ...articleDefaults,
    ...(useSelector(getArticle(id)) || {}),
  }
  const dispatch = useDispatch()
  const isDraft = !article.publishedAt

  const [body, setBody] = useState(article.body)
  const [excerpt, setExcerpt] = useState(article.excerpt)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [title, setTitle] = useState(article.title)

  const saveArticle = async (publish = false) => {
    setIsUpdating(true)

    const newArticle = await dispatch(actions.saveArticle({
      ...article,
      body,
      excerpt,
      title,
    }, publish))

    if (!id) {
      Router.replaceRoute('edit article', { id: newArticle.id }, { shallow: true })
    }

    setIsUpdating(false)
  }

  const loadArticle = async () => {
    await dispatch(actions.getArticle(id, true))
    setIsLoading(false)
  }

  useEffect(() => {
    if (!article && !isLoading) {
      setIsLoading(true)
      loadArticle()
    }
  })

  return (
    <PageWrapper title={`Editing Article: ${title}`}>
      <section>
        <header>
          <h2>
            <input
              onChange={({ target: { value } }) => setTitle(value)}
              placeholder="Title"
              value={title} />
          </h2>
        </header>

        <form onSubmit={event => event.preventDefault()}>
          <fieldset>
            <textarea
              aria-label="Excerpt"
              onChange={({ target: { value } }) => setExcerpt(value)}
              placeholder="Excerpt"
              value={excerpt} />
          </fieldset>

          <fieldset>
            <textarea
              aria-label="Body"
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
