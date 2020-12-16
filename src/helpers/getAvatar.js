export default function getAvatar(profile) {
	const {
		avatarURL,
		avatarUrl,
		displayName,
		username,
	} = profile

	return avatarURL || avatarUrl || `https://avatars.dicebear.com/api/identicon/${username || displayName}.svg`
}
