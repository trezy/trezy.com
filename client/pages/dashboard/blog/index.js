// Module imports
import React, {
  useEffect,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'





// Component imports
import { actions } from '../../../store'
import { Link } from '../../../routes'
import PageWrapper from '../../../components/PageWrapper'
import requireAuthentication from '../../../components/requireAuthentication'
import getArticlesSelector from '../../../store/selectors/getArticlesSelector'





const BlogDashboard = () => {
  const articles = useSelector(getArticlesSelector())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.connectCollection('articles'))

    return () => dispatch(actions.disconnectCollection('articles'))
  })

  return (
    <PageWrapper title="Blog Dashboard">
      <section>
        <header>
          <h2>Dashboard / Blog</h2>
        </header>

        <Link route="new article">
          <a className="button">
            New Article
          </a>
        </Link>

        <ol>
          {articles.map(({ id, title }) => (
            <li key={id}>
              <article>
                <header>
                  {title}

                  <menu type="toolbar">
                    <Link
                      params={{ id }}
                      route="edit article">
                      <a className="button">
                        Edit
                      </a>
                    </Link>
                  </menu>
                </header>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </PageWrapper>
  )
}





export default requireAuthentication(BlogDashboard)
