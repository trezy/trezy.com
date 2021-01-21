// Module imports
import {
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { useAuth } from 'contexts/AuthContext'
import { useProfiles } from 'contexts/ProfilesContext'
import PageWrapper from 'components/PageWrapper'
import Profile from 'components/Profile'





function ProfilePage(props) {
	const {
		username,
	} = props
	const {
		addProfile,
		profilesByUsername,
		useProfileWatcher,
	} = useProfiles()
	const authContext = useAuth()
	const router = useRouter()
	const [profileFromSSR, setProfileFromSSR] = useState(props.profile)
	let profile = profileFromSSR || profilesByUsername[username]

	if (!username) {
		profile = authContext.profile
	}

	const userOwnsProfile = authContext.isLoaded && (profile?.id === authContext.user?.uid)

	useEffect(() => {
		setProfileFromSSR(null)

		if (!profilesByUsername[username] && props.profile) {
			addProfile(props.profile)
		}
	}, [])

	useEffect(() => {
		if ((profile?.visibility === 'private') && !userOwnsProfile) {
			window.location.reload()
		}
	}, [profile])

	useProfileWatcher({ username })

	if (!profile) {
		return (
			<PageWrapper title="Profile Not Found">
				<section className="block">
					<p>This profile is currently unavailable, or we couldn't find a profile with that username. 😞</p>
				</section>
			</PageWrapper>
		)
	}

	return (
		<Profile
			profile={profile}
			username={username} />
	)
}

ProfilePage.defaultProps = {
	profile: null,
	username: '',
}

ProfilePage.propTypes = {
	profile: PropTypes.object,
	username: PropTypes.string,
}

export async function getServerSideProps(context) {
	const { firestore } = await import('helpers/firebase')
	const username = context.params.username?.[0]

	if (!username) {
		return {
			props: {
				profile: null,
				username: '',
			},
		}
	}

	if (!username.startsWith('@')) {
		return {
			redirect: {
				destination: `/profile/@${username}`,
				permanent: true,
			},
		}
	}

	const safeUsername = username.startsWith('@') ? username.substring(1) : username
	let profile = null
	let profileSnapshot = null

	try {
		profileSnapshot = await firestore
			.collection('profiles')
			.where('visibility', '!=', 'private')
			.where('username', '==', safeUsername)
			.get()

		profileSnapshot.forEach(doc => {
			profile = {
				...doc.data(),
				id: doc.id,
			}
		})
	} catch (error) {
		console.log('ERROR', error)
	}

	return {
		props: {
			profile,
			username: safeUsername,
		},
	}
}

export default ProfilePage
