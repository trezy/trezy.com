// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import ArticleList from '../components/ArticleList'
import PageWrapper from '../components/PageWrapper'
import RequireAuthentication from '../components/RequireAuthentication'
import useAuthSelector from '../store/selectors/useAuthSelector'
import useUserSelector from '../store/selectors/useUserSelector'





const Profile = () => {
  const auth = useAuthSelector()
  const user = useUserSelector({ userID: auth.uid })
  const collections = []

  if (isLoaded(auth) && !isEmpty(auth)) {
    collections.push({
      collection: 'users',
      doc: auth.uid,
    })
  }

  useFirestoreConnect(collections)

  if (!isEmpty(user)) {
    user.socialMedia = [
      {
        type: 'twitch',
        url: 'https://twitch.tv/TrezyCodes',
      },
      {
        type: 'twitter',
        url: 'https://twitter.com/TrezyCodes',
      },
    ]
  }

  return (
    <PageWrapper title="Profile">
      <RequireAuthentication>
        {(!isLoaded(user) || !isLoaded(user)) && (
          <span>Loading...</span>
        )}

        {(isLoaded(user) && !isEmpty(user)) && (
          <>
            <header className="card no-pad user">
              <img
                alt={`${user.displayName}'s avatar`}
                // className="avatar"
                src={user.avatarUrl} />

              <header>
                {user.displayName}
              </header>

              <dl className="content">
                <dt>Bio</dt>
                <dd>
                  {user.bio || (
                    <p>
                      <em>No bio... yet</em>
                    </p>
                  )}
                </dd>

                {user.website && (
                  <>
                    <dt>Website</dt>
                    <dd>{user.website}</dd>
                  </>
                )}

                {user.socialMedia?.length && (
                  <>
                    <dt>Social</dt>
                    <dd>
                      <ul className="inline">
                        {user.socialMedia.map(({ type, url }) => (
                          <li key={url}>
                            <a
                              href={url}
                              rel="me noopener noreferrer"
                              target="_blank">
                              <FontAwesomeIcon
                                fixedWidth
                                icon={['fab', type]}
                                title={type} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </>
                )}
              </dl>
            </header>

            <section>
              <header>
                <h3>
                  Articles
                </h3>
              </header>

              {(isLoaded(auth) && !isEmpty(auth)) && (
                <ArticleList authorID={auth.uid} />
              )}

              {/* No articles... yet */}
            </section>
          </>
        )}
      </RequireAuthentication>
    </PageWrapper>
  )
}





export default Profile
