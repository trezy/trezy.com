// Module imports
import {
  isEmpty,
  isLoaded,
  useFirestoreConnect,
} from 'react-redux-firebase'
import React, {
  useEffect,
  useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getFirestore } from 'redux-firestore'





// Component imports
import Alert from '../components/Alert'
import ArticleList from '../components/ArticleList'
import Image from '../components/Image'
import Input from '../components/Input'
import PageWrapper from '../components/PageWrapper'
import RequireAuthentication from '../components/RequireAuthentication'
import useAuthSelector from '../store/selectors/useAuthSelector'
import useUserSelector from '../store/selectors/useUserSelector'





// Local constants
const SAVE_ALERT_DURATION = 5000





const Profile = () => {
  const firestore = getFirestore()

  const auth = useAuthSelector()
  const user = useUserSelector({ userID: auth.uid })
  const collections = []

  const [bio, setBio] = useState('')
  const [editMode, setEditMode] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [website, setWebsite] = useState('')

  if (isLoaded(auth) && !isEmpty(auth)) {
    collections.push({
      collection: 'users',
      doc: auth.uid,
    })
  }

  useFirestoreConnect(collections)

  useEffect(() => {
    if (!editMode && !isEmpty(user)) {
      setBio(user.bio || null)
      setWebsite(user.website || null)
    }
  })

  const handleCancel = () => {
    setBio(user.bio)
    setWebsite(user.website)
    setEditMode(false)
  }

  const handleEdit = () => setEditMode(true)

  const handleSave = async () => {
    setIsSaving(true)

    await firestore.update({ collection: 'users', doc: auth.uid }, {
      bio,
      website,
    })

    setEditMode(false)
    setIsSaving(false)
    setIsSaved(true)

    setTimeout(() => setIsSaved(false), SAVE_ALERT_DURATION)
  }

  return (
    <PageWrapper title="Profile">
      <RequireAuthentication>
        {(!isLoaded(user) || !isLoaded(user)) && (
          <span>Loading...</span>
        )}

        {(isLoaded(user) && !isEmpty(user)) && (
          <>
            {isSaved && (
              <Alert
                data-animate
                data-animation="fade-in-from-top"
                data-animation-duration="0.2s"
                type="success">
                Success! Your profile has been updated. <span aria-label="Grinning face emoji" role="img">😁</span>
              </Alert>
            )}

            <header className="card no-pad user">
              <Image
                alt={`${user.displayName}'s avatar`}
                src={user.avatarUrl} />

              <header>
                {user.displayName}
              </header>

              {!editMode && (
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
              )}

              {editMode && (
                <dl className="content">
                  <dt>Bio</dt>
                  <dd>
                    <Input
                      disabled={isSaving}
                      multiline
                      onChange={({ target: { value } }) => setBio(value)}
                      placeholder={`${user.displayName} was just a child when their interest in flowers began to blossom...`}
                      value={bio} />
                  </dd>

                  <dt>Website</dt>
                  <dd>
                    <Input
                      disabled={isSaving}
                      onChange={({ target: { value } }) => setWebsite(value)}
                      placeholder="https://example.com"
                      type="url"
                      value={website} />
                  </dd>
                </dl>
              )}

              <footer>
                <menu type="toolbar">
                  {!editMode && (
                    <button
                      className="primary"
                      onClick={handleEdit}
                      type="button">
                      Edit Profile
                    </button>
                  )}

                  {editMode && (
                    <>
                      <button
                        className="danger"
                        onClick={handleCancel}
                        type="button">
                        Cancel
                      </button>

                      <button
                        className="primary"
                        onClick={handleSave}
                        type="button">
                        {!isSaving && (
                          <span>Save Changes</span>
                        )}

                        {isSaving && (
                          <span>
                            <FontAwesomeIcon
                              icon="spinner"
                              pulse />
                            Saving...
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </menu>
              </footer>
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
            </section>
          </>
        )}
      </RequireAuthentication>
    </PageWrapper>
  )
}





export default Profile
