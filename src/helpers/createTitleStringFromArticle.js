const createTitleStringFromArticle = article => {
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
