// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useProfiles } from 'contexts/ProfilesContext'
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import ProfileCard from 'components/ProfileCard'





// Local constants
const SAVE_ALERT_DURATION = 5000





function Profile(props) {
	const { username } = props
	const {
		addProfile,
		connectProfileByUsername,
		disconnectProfileByUsername,
		profilesByUsername,
	} = useProfiles()
	const profile = profilesByUsername[username] || props.profile

	useEffect(() => {
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

	if (!profile) {
		return <div>butts</div>
	}

	return (
		<PageWrapper
			showHeader={false}
			title={`${profile.displayName}'s Profile`}>
			<ProfileCard user={profile} />

			<section className="block">
				<header>
					<h3>Articles</h3>
				</header>

				<ArticleList
					authorID={profile.id}
					includeStyles={false} />
			</section>
		</PageWrapper>
	)
}

Profile.defaultProps = {
	profile: null,
	username: '',
}

Profile.propTypes = {
	profile: PropTypes.object,
	username: PropTypes.string,
}





export default Profile
