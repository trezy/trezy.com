// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Component imports
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import ProfileCard from 'components/ProfileCard'





// Local constants
const SAVE_ALERT_DURATION = 5000





function Profile(props) {
	const {
		profile,
		username,
	} = props

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

Profile.propTypes = {
	profile: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
}





export default Profile
