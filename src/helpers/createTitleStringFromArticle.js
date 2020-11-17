const createTitleStringFromArticle = article => {
	if (!article) {
		return ''
	}

	const {
		subtitle,
		title,
	} = article

	let titleString = title

	if (subtitle) {
		titleString = `${title} - ${subtitle}`
	}

	return titleString
}





export default createTitleStringFromArticle
