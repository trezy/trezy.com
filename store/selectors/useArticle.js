const useArticle = slug => ({ firestore }) => {
  const articles = Object.values(firestore.data.articles)

  return articles.find(article => (article.slug === slug))
}





export default useArticle
