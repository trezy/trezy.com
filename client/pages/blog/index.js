// Module imports
import React, {
  useEffect,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import moment from 'moment'





// Component imports
import { actions } from '../../store'
import { firebase } from '../../helpers/firebase'
import { Link } from '../../routes'
import PageWrapper from '../../components/PageWrapper'
import getArticlesSelector from '../../store/selectors/getArticlesSelector'





const Blog = () => {
  const articles = useSelector(getArticlesSelector())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.connectCollection('articles', {
      where: [
        ['publishedAt', '>', firebase.firestore.Timestamp.fromDate(new Date(0))],
      ],
    }))

    return () => dispatch(actions.disconnectCollection('articles'))
  })

  return (
    <PageWrapper title="Blog">
      <section>
        <header>
          <h2>Blog</h2>
        </header>

        <ol className="article-list">
          {articles.map(({ id, publishedAt, title }) => (
            <li key={id}>
              <article>
                <header>
                  <h3>
                    <Link
                      params={{ id }}
                      route="view article">
                      <a>
                        {title}
                      </a>
                    </Link>
                  </h3>
                </header>

                <div className="meta">
                  <span>Published {moment(publishedAt.seconds * 1000).format('D MMMM, Y')}</span>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </PageWrapper>
  )
}





export default Blog
