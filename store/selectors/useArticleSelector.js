// Module imports
import { useSelector } from 'react-redux'





const useArticleSelector = slug => useSelector(({ firestore }) => {
  console.log('firestore.data.articles', firestore.data.articles)

  if (!firestore.data.articles) {
    return firestore.data.articles
  }

  const articles = Object.values(firestore.data.articles)

  return articles.find(article => (article.slug === slug))
})





export default useArticleSelector
