// Module imports
import PropTypes from 'prop-types'





// Component imports
import ArticleList from 'components/ArticleList'
import PageWrapper from 'components/PageWrapper'
import ProfileCard from 'components/ProfileCard'





function Profile(props) {
	const {
		articles,
		profile,
	} = props

	return (
		<PageWrapper
			showHeader={false}
			title={`${profile.displayName}'s Profile`}>
			<ProfileCard profile={profile} />

			<section className="block">
				<header>
					<h3>Articles</h3>
				</header>

				<ArticleList
					authorID={profile.id}
					articles={articles}
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
