// Module imports
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'
import getAvatar from 'helpers/getAvatar'
import Image from 'components/Image'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import MarkdownRenderer from 'components/MarkdownRenderer'





function ProfileCard(props) {
	const {
		linkToProfile,
		profile,
	} = props
	const {
		bio,
		displayName,
		email,
		roles,
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

				<dl className="content">
					<dt>Username</dt>

					<dd>
						{Boolean(username) && (
							`@${username}`
						)}

						{!username && (
							<em>No username</em>
						)}
					</dd>

					<dt>Bio</dt>

					{Boolean(bio) && (
						<dd>
							<MarkdownRenderer children={bio} />
						</dd>
					)}

					{!bio && (
						<dd>
							<p>
								<em>No bio... yet</em>
							</p>
						</dd>
					)}

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
