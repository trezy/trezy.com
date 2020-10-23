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
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import Alert from 'components/Alert'
import ArticleList from 'components/ArticleList'
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'
import Image from 'components/Image'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'
import useAuthSelector from 'store/selectors/useAuthSelector'
import useUserSelector from 'store/selectors/useUserSelector'
import useUsersSelector from 'store/selectors/useUsersSelector'





// Local constants
const SAVE_ALERT_DURATION = 5000





function Profile(props) {
	const Router = useRouter()

	if ((typeof window !== 'undefined') && !props.username.startsWith('@')) {
		const href = '/profile/[username]'
		const as = `/profile/@${props.username}`

		Router.replace(href, as)
	}

	const firestore = getFirestore()

	const auth = useAuthSelector()
	const user = useUserSelector({ username: props.safeUsername })
	const users = useUsersSelector()
	const collections = []

	const [bio, setBio] = useState('')
	const [editMode, setEditMode] = useState(false)
	const [previewMode, setPreviewMode] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [username, setUsername] = useState('')
	const [website, setWebsite] = useState('')

	if (isLoaded(auth) && !isEmpty(auth)) {
		collections.push({
			collection: 'users',
			where: ['username', '==', props.safeUsername],
		})
	}

	useFirestoreConnect(collections)

	useEffect(() => {
		if (!editMode && !isEmpty(user)) {
			setBio(user.bio || null)
			setUsername(user.username || null)
			setWebsite(user.website || null)
		}
	})

	const handleCancel = () => {
		setBio(user.bio)
		setUsername(user.username)
		setWebsite(user.website)
		setEditMode(false)
	}

	const handleEdit = () => setEditMode(true)

	const handleSave = async () => {
		setIsSaving(true)

		await firestore.update({ collection: 'users', doc: auth.uid }, {
			bio,
			username,
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
				{!isLoaded(users) && (
					<span>Loading...</span>
				)}

				{(isLoaded(users) && isEmpty(users)) && (
					<span>No user found with that username.</span>
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

							{(!editMode || previewMode) && (
								<dl className="content">
									<dt>Username</dt>
									<dd>@{username}</dd>

									<dt>Bio</dt>

									{Boolean(user.bio) && (
										<dd>
											<MarkdownRenderer source={user.bio} />
										</dd>
									)}

									{!user.bio && (
										<dd>
											<p>
												<em>No bio... yet</em>
											</p>
										</dd>
									)}

									{user.website && (
										<>
											<dt>Website</dt>
											<dd>
												<ExternalLink href={user.website}>
													{user.website}
												</ExternalLink>
											</dd>
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

							{(editMode && !previewMode) && (
								<dl className="content">
									<dt>Username</dt>
									<dd>
										<Input
											disabled={isSaving}
											onChange={({ target: { value } }) => setUsername(value)}
											placeholder={`${user.displayName.toLowerCase().replace(/[^\w]/gu, '-').replace(/-+/gu, '-')}`}
											prefix="@"
											type="text"
											value={username} />
									</dd>

									<dt>
										Bio
										<small>
											<FontAwesomeIcon
												fixedWidth
												icon={['fab', 'markdown']} />
											Markdown supported
										</small>
									</dt>
									<dd>
										<MarkdownEditor
											disabled={isSaving}
											multiline
											onChange={({ target: { value } }) => setBio(value)}
											previewMode={false}
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
										<Button
											className="primary"
											onClick={handleEdit}>
											Edit Profile
										</Button>
									)}

									{editMode && (
										<>
											<Button
												className="danger"
												onClick={handleCancel}>
												Cancel
											</Button>

											{!previewMode && (
												<Button
													className="primary"
													onClick={() => setPreviewMode(true)}>
													Preview
												</Button>
											)}

											{previewMode && (
												<Button
													className="primary"
													onClick={() => setPreviewMode(false)}>
													Edit
												</Button>
											)}

											<Button
												className="primary"
												onClick={handleSave}>
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
											</Button>
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

Profile.getInitialProps = async ({ query }) => {
	const { username } = query
	const safeUsername = username.startsWith('@') ? username.substring(1) : username
	const firestore = getFirestore()

	await firestore.get({
		collection: 'users',
		where: ['username', '==', safeUsername],
	})

	return {
		safeUsername,
		username,
	}
}

Profile.defaultProps = {
	safeUsername: '',
	username: '',
}

Profile.propTypes = {
	safeUsername: PropTypes.string,
	username: PropTypes.string,
}





export default Profile
