// Local imports
import actionTypes from '../actionTypes'
import {
  firebase,
  firebaseApp,
} from '../../helpers/firebase'





// Local constants
const database = firebaseApp.firestore()





export const getArticle = id => async dispatch => {
  const collection = database.collection('articles')

  const documentSnapshot = await collection.doc(id).get()
  const data = await documentSnapshot.data()

  dispatch({
    payload: {
      ...data,
      id,
    },
    status: 'success',
    type: actionTypes.GET_ARTICLE,
  })
}





export const getArticles = (limit = false, includeDrafts = false) => async dispatch => {
  const results = {}
  let collection = database.collection('articles')

  if (!includeDrafts) {
    collection = collection.where('publishedAt', '>', firebase.firestore.Timestamp.fromDate(new Date(0)))
  }

  collection = collection.orderBy('publishedAt', 'desc')

  if (limit) {
    collection = collection.limit(limit)
  }

  const querySnapshot = await collection.get()

  querySnapshot.forEach(doc => {
    results[doc.id] = {
      ...doc.data(),
      id: doc.id,
    }
  })

  dispatch({
    payload: results,
    status: 'success',
    type: actionTypes.GET_ARTICLES,
  })
}





export const getLatestArticle = (includeDrafts = false) => async dispatch => {
  let collection = database.collection('articles')

  if (!includeDrafts) {
    collection = collection.where('publishedAt', '>', firebase.firestore.Timestamp.fromDate(new Date(0)))
  }

  collection = collection.orderBy('publishedAt', 'desc')
  collection = collection.limit(1)

  const querySnapshot = await collection.get()
  const data = querySnapshot.docs[0].data()
  const [{ id }] = querySnapshot.docs

  dispatch({
    payload: {
      ...data,
      id,
    },
    status: 'success',
    type: actionTypes.GET_ARTICLE,
  })
}





export const saveArticle = (article, publish = false) => async dispatch => {
  const collection = database.collection('articles')
  const serializedArticle = { ...article }
  const { id } = article

  if (publish) {
    serializedArticle.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
  } else {
    delete serializedArticle.publishedAt
  }

  if (id) {
    delete serializedArticle.id
    await collection.doc(id).set(serializedArticle, { merge: true })
  } else {
    const documentReference = await collection.add(serializedArticle)
    serializedArticle.id = documentReference.id
  }

  dispatch({
    payload: serializedArticle,
    status: 'success',
    type: actionTypes.SAVE_ARTICLE,
  })

  return serializedArticle
}
