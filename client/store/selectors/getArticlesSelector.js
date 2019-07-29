import moment from 'moment'





const sortArticles = (articleA, articleB) => {
  if (!articleA.publishedAt || !articleB.publishedAt) {
    if (Boolean(articleA.publishedAt) && !articleB.publishedAt) {
      return 1
    }

    if (!articleA.publishedAt && Boolean(articleB.publishedAt)) {
      return -1
    }

    return 0
  }

  const publishDateA = moment(articleA.publishedAt.seconds * 1000)
  const publishDateB = moment(articleB.publishedAt.seconds * 1000)

  if (publishDateA < publishDateB) {
    return 1
  }

  if (publishDateA > publishDateB) {
    return -1
  }

  return 0
}

const getArticlesSelector = () => ({ articles }) => {
  const articleList = Object.values(articles)

  return articleList.sort(sortArticles)
}





export default getArticlesSelector
