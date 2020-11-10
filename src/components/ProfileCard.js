// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import Button from 'components/Button'
import ExternalLink from 'components/ExternalLink'
import getAvatar from 'helpers/getAvatar'
import Image from 'components/Image'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import MarkdownRenderer from 'components/MarkdownRenderer'





function ProfileCard(props) {
	const {
		editMode,
		isSaving,
		linkToProfile,
		onBioChange,
		onCancelEdit,
		onEditProfile,
		onPreview,
		onSaveChanges,
		onUsernameChange,
		onWebsiteChange,
		previewMode,
		showToolbar,
		user,
	} = props
	const {
		bio,
		displayName,
		email,
		roles,
		socialMedia,
		username,
		website,
	} = user

	return (
		<header className="block no-pad">
			<div className="card profile">
				<Image
					alt={`${displayName}'s avatar`}
					src={getAvatar(user)} />

				<header>
					{linkToProfile && (
						<Link
							as={`/profile/@${username}`}
							href="/profile/[username]">
							{displayName || username}
						</Link>
					)}

					{!linkToProfile && `${displayName || username}`}
				</header>

				{(!editMode || previewMode) && (
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
								<MarkdownRenderer source={bio} />
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
				)}

				{(editMode && !previewMode) && (
					<dl className="content">
						<dt>Username</dt>
						<dd>
							<Input
								disabled={isSaving}
								onChange={onUsernameChange}
								placeholder={`${displayName.toLowerCase().replace(/[^\w]/gu, '-').replace(/-+/gu, '-')}`}
								prefix="@"
								type="text"
								value={username} />
						</dd>

						<dt>
							Bio
							<small>
								<FontAwesomeIcon
									fixedWidth
									icon={['fab', 'markdown']} />
								Markdown supported
							</small>
						</dt>
						<dd>
							<MarkdownEditor
								disabled={isSaving}
								multiline
								onChange={onBioChange}
								previewMode={false}
								placeholder={`${displayName} was just a child when their interest in flowers began to blossom...`}
								value={bio} />
						</dd>

						<dt>Website</dt>
						<dd>
							<Input
								disabled={isSaving}
								onChange={onWebsiteChange}
								placeholder="https://example.com"
								type="url"
								value={website} />
						</dd>
					</dl>
				)}

				{showToolbar && (
					<footer>
						<menu type="toolbar">
							{!editMode && (
								<Button
									className="primary"
									onClick={onEditProfile}>
									Edit Profile
								</Button>
							)}

							{editMode && (
								<>
									<Button
										className="danger"
										onClick={onCancelEdit}>
										Cancel
									</Button>

									{!previewMode && (
										<Button
											className="primary"
											onClick={onPreview}>
											Preview
										</Button>
									)}

									{previewMode && (
										<Button
											className="primary"
											onClick={onEditProfile}>
											Edit
										</Button>
									)}

									<Button
										className="primary"
										onClick={onSaveChanges}>
										{!isSaving && (
											<span>Save Changes</span>
										)}

										{isSaving && (
											<span>
												<FontAwesomeIcon
													icon="spinner"
													pulse />
												Saving...
											</span>
										)}
									</Button>
								</>
							)}
						</menu>
					</footer>
				)}
			</div>
		</header>
	)
}

ProfileCard.defaultProps = {
	editMode: false,
	isSaving: false,
	linkToProfile: false,
	onBioChange: () => {},
	onCancelEdit: () => {},
	onEditProfile: () => {},
	onPreview: () => {},
	onSaveChanges: () => {},
	onUsernameChange: () => {},
	onWebsiteChange: () => {},
	showToolbar: false,
	previewMode: false,
}

ProfileCard.propTypes = {
	editMode: PropTypes.bool,
	isSaving: PropTypes.bool,
	linkToProfile: PropTypes.bool,
	onBioChange: PropTypes.func,
	onCancelEdit: PropTypes.func,
	onEditProfile: PropTypes.func,
	onPreview: PropTypes.func,
	onSaveChanges: PropTypes.func,
	onUsernameChange: PropTypes.func,
	onWebsiteChange: PropTypes.func,
	previewMode: PropTypes.bool,
	showToolbar: PropTypes.bool,
	user: PropTypes.object.isRequired,
}





export default ProfileCard
