// Module imports
import PropTypes from 'prop-types'





// Component imports
import { firestore } from 'helpers/firebase'
import Profile from 'components/Profile'





function ProfilePage(props) {
	const {
		profile,
		username,
	} = props

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
	const { username } = context.params

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

	const profileSnapshot = await firestore
		.collection('profiles')
		.where('username', '==', safeUsername)
		.get()

	profileSnapshot.forEach(doc => {
		profile = {
			...doc.data(),
			id: doc.id,
		}
	})

	if (!profile) {
		return { notFound: true }
	}

	return {
		props: {
			profile,
			username: safeUsername,
		},
	}
}





export default ProfilePage
