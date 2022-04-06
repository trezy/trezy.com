// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'





// Local imports
import { ExternalLink } from 'components/ExternalLink'
import getAvatar from 'helpers/getAvatar'
import Image from 'components/Image'
import MarkdownRenderer from 'components/MarkdownRenderer'





function ProfileCard(props) {
	const {
		linkToProfile,
		profile,
	} = props
	const {
		bio,
		displayName,
		socialMedia,
		username,
		website,
	} = profile || {}

	return (
		<header className="block no-pad">
			<div className="card profile">
				<Image
					alt={`${displayName}'s avatar`}
					src={getAvatar(profile)} />

				<header>
					{linkToProfile && (
						<Link href={`/profile/@${username}`}>
							{displayName || username}
						</Link>
					)}

					{!linkToProfile && `${displayName || username}`}
				</header>

				<div className="content">
					<dl>
						<dt>Username</dt>

						<dd>
							{Boolean(username) && (
								`@${username}`
							)}

							{!username && (
								<em>No username</em>
							)}
						</dd>

						<dt className="full-width">Bio</dt>

						<dd className="full-width">
							{Boolean(bio) && (
								<MarkdownRenderer children={bio} />
							)}

							{!bio && (
								<p><em>No bio... yet</em></p>
							)}
						</dd>

						{website && (
							<>
								<dt>Website</dt>
								<dd>
									<ExternalLink href={website}>
										{website}
									</ExternalLink>
								</dd>
							</>
						)}

						{socialMedia?.length && (
							<>
								<dt>Social</dt>
								<dd>
									<ul className="inline">
										{socialMedia.map(({ type, url }) => (
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
				</div>
			</div>
		</header>
	)
}

ProfileCard.defaultProps = {
	linkToProfile: false,
}

ProfileCard.propTypes = {
	linkToProfile: PropTypes.bool,
	profile: PropTypes.object.isRequired,
}





export default ProfileCard
