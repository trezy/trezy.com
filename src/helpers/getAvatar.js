export default function getAvatar(profile) {
	const {
		avatarUrl,
		displayName,
		username,
	} = profile

	return avatarUrl || `https://avatars.dicebear.com/api/identicon/${username || displayName}.svg`
}
