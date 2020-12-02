// Module imports
import {
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { useProfiles } from 'contexts/ProfilesContext'
import PageWrapper from 'components/PageWrapper'
import Profile from 'components/Profile'





function ProfilePage(props) {
	const {
		username,
	} = props
	const {
		addProfile,
		connectProfileByUsername,
		disconnectProfileByUsername,
		profilesByUsername,
	} = useProfiles()
	const router = useRouter()
	const [profileFromSSR, setProfileFromSSR] = useState(props.profile)
	const profile = profileFromSSR || profilesByUsername[username]

	useEffect(() => {
		setProfileFromSSR(null)

		if (!profilesByUsername[username] && props.profile) {
			addProfile(props.profile)
		}
	}, [])

	useEffect(() => {
		connectProfileByUsername(username)
		return () => disconnectProfileByUsername(username)
	}, [
		connectProfileByUsername,
		disconnectProfileByUsername,
	])

	useEffect(() => {
		if (profile?.visibility === 'private') {
			router.reload()
		}
	}, [profile])

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
