export function getArticleURL(article, isRelative = true) {
	const relativeURL = `/blog/${article.slug}`

	if (isRelative) {
		return relativeURL
	}

	return `https://trezy.com${isRelative}`
}
