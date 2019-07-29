// Module imports
import React, {
  useState,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import PropTypes from 'prop-types'





// Component imports
import { actions } from '../../../store'
import { Router } from '../../../routes'
import getArticle from '../../../store/selectors/getArticleSelector'
import PageWrapper from '../../../components/PageWrapper'
import requireAuthentication from '../../../components/requireAuthentication'





const BlogEditor = ({ query: { id } }) => {
  const article = useSelector(getArticle(id)) || {
    body: '',
    publishedAt: null,
    title: '',
  }
  const dispatch = useDispatch()
  const isDraft = !article.publishedAt

  const [body, setBody] = useState(article.body)
  const [title, setTitle] = useState(article.title)

  const saveArticle = async (publish = false) => {
    const newArticle = await dispatch(actions.saveArticle({
      ...article,
      body,
      title,
    }, publish))

    if (!id) {
      Router.replaceRoute('edit article', { id: newArticle.id }, { shallow: true })
    }
  }

  return (
    <PageWrapper title={title}>
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
              aria-label="Body"
              id="article-content"
              onChange={({ target: { value } }) => setBody(value)}
              placeholder="Body"
              value={body} />
          </fieldset>

          <menu type="toolbar">
            <button
              onClick={() => saveArticle()}
              type="submit">
              Save
            </button>

            {isDraft && (
              <button
                onClick={() => saveArticle(true)}
                type="submit">
                Publish
              </button>
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
