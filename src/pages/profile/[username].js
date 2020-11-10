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
import getAvatar from 'helpers/getAvatar'
import Image from 'components/Image'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'
import ProfileCard from 'components/ProfileCard'
import useAuthSelector from 'store/selectors/useAuthSelector'
import useUserSelector from 'store/selectors/useUserSelector'
import useUsersSelector from 'store/selectors/useUsersSelector'





// Local constants
const SAVE_ALERT_DURATION = 5000





function Profile(props) {
	const Router = useRouter()

	if ((typeof window !== 'undefined') && !props.username.startsWith('@') && (props.username !== 'me')) {
		const href = '/profile/[username]'
		const as = `/profile/@${props.username}`

		Router.replace(href, as)
	}

	const firestore = getFirestore()
	const auth = useAuthSelector()
	const users = useUsersSelector()

	const userSelectorQuery = {}

	if (props.username === 'me') {
		userSelectorQuery.userID = auth?.uid
	} else {
		userSelectorQuery.username = props.safeUsername
	}

	const user = useUserSelector(userSelectorQuery)
	const collections = []

	const [bio, setBio] = useState('')
	const [editMode, setEditMode] = useState(false)
	const [previewMode, setPreviewMode] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [username, setUsername] = useState('')
	const [website, setWebsite] = useState('')

	const viewerIsOwner = auth?.uid === user?.id

	if (isLoaded(auth)) {
		const query = {
			collection: 'users',
		}

		if (!isEmpty(auth) && (props.username === 'me')) {
			query.doc = auth.uid
		} else {
			query.where = ['username', '==', props.safeUsername]
		}

		collections.push(query)
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

	const handleEdit = () => {
		setEditMode(true)
		setPreviewMode(false)
	}

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
		<PageWrapper
			showHeader={false}
			title={!isEmpty(user) ? `${user.displayName}'s Profile` : 'User Profile'}>
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

					<ProfileCard
						editMode={editMode}
						isSaving={isSaving}
						onBioChange={({ target: { value } }) => setBio(value)}
						onCancelEdit={handleCancel}
						onEditProfile={handleEdit}
						onPreview={() => setPreviewMode(true)}
						onSaveChanges={handleSave}
						onUsernameChange={({ target: { value } }) => setUsername(value)}
						onWebsiteChange={({ target: { value } }) => setWebsite(value)}
						previewMode={previewMode}
						showToolbar={viewerIsOwner}
						user={{
							avatarUrl: user.avatarUrl,
							bio: bio || user.bio,
							displayName: user.displayName,
							email: user.email,
							roles: user.roles,
							socialMedia: user.socialMedia,
							username: username || user.username,
							website: website || user.website,
						}} />

					<section className="block">
						<header>
							<h3>Articles</h3>
						</header>

						{(isLoaded(auth) && !isEmpty(auth)) && (
							<ArticleList
								authorID={auth.uid}
								includeStyles={false} />
						)}
					</section>
				</>
			)}
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
