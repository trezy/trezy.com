// Module imports
import {
	useEffect,
	useState,
} from 'react'
import {
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { createClient as createContentfulClient } from 'contentful'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'




// Component imports
import { calculateReadtime } from 'helpers/calculateReadtime'
import { firestore } from 'helpers/firebase'
import { useAuth } from 'contexts/AuthContext'
import { useProfiles } from 'contexts/ProfilesContext'
import PageWrapper from 'components/PageWrapper'
import Profile from 'components/Profile'




function ProfilePage(props) {
	const {
		articles = [],
		username = '',
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
					<p>This profile is currently unavailable, or we couldn't find a profile with that username.</p>
				</section>
			</PageWrapper>
		)
	}

	return (
		<Profile
			articles={articles}
			profile={profile}
			username={username} />
	)
}

ProfilePage.propTypes = {
	articles: PropTypes.array,
	profile: PropTypes.object,
	username: PropTypes.string,
}

export async function getStaticPaths() {
	const paths = [
		{
			params: {
				username: [],
			},
		},
	]

	const profilesRef = collection(firestore, 'profiles')
	const q = query(profilesRef, where('visibility', '!=', 'private'))
	const profilesSnapshot = await getDocs(q)

	profilesSnapshot.forEach(profileSnapshot => {
		const { username } = profileSnapshot.data()

		if (username) {
			paths.push({
				params: {
					username: [username],
				},
			})

			paths.push({
				params: {
					username: [`@${username}`],
				},
			})
		}
	})

	return {
		fallback: true,
		paths,
	}
}

export async function getStaticProps(context) {
	const username = context.params.username?.[0]

	if (!username) {
		return {
			props: {
				profile: null,
				username: '',
			},
		}
	}

	const safeUsername = username.startsWith('@') ? username.substring(1) : username

	const profilesRef = collection(firestore, 'profiles')
	const q = query(
		profilesRef,
		where('visibility', '!=', 'private'),
		where('username', '==', safeUsername),
	)
	const profileQuerySnapshot = await getDocs(q)

	if (profileQuerySnapshot.size === 0) {
		return { notFound: true }
	}

	const profileSnapshot = profileQuerySnapshot.docs[0]

	const contentfulClient = createContentfulClient({
		space: process.env.CONTENTFUL_API_SPACE_ID,
		accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN,
	})

	const contentfulResponse = await contentfulClient
		.getEntries({
			content_type: 'article',
			'fields.authorIDs': [profileSnapshot.id],
		})

	return {
		props: {
			articles: contentfulResponse.items.map(item => {
				return {
					...item.fields,
					id: item.sys.id,
					createdAt: item.fields.legacyPublishedAt || item.fields.legacyCreatedAt || item.sys.createdAt,
					readtime: calculateReadtime(item.fields.body),
					updatedAt: item.sys.updatedAt,
				}
			}),
			profile: {
				...profileSnapshot.data(),
				id: profileSnapshot.id,
			},
			username: safeUsername,
		},
		revalidate:
			1 /* minutes */ *
			60 /* seconds */ *
			1000 /* milliseconds */,
	}
}

export default ProfilePage
