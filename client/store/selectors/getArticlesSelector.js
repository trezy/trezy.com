import moment from 'moment'





const getArticlesSelector = () => ({ articles }) => {
  const articleList = Object.values(articles)

  return articleList.sort((articleA, articleB) => {
    const publishDateA = moment(articleA.publishedAt.seconds * 1000)
    const publishDateB = moment(articleB.publishedAt.seconds * 1000)

    if (publishDateA < publishDateB) {
      return 1
    }

    if (publishDateA > publishDateB) {
      return -1
    }

    return 0
  })
}





export default getArticlesSelector
