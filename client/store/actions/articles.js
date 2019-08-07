// Module imports
import moment from 'moment'
import uuid from 'uuid/v4'





// Local imports
import actionTypes from '../actionTypes'
import { firebaseApp } from '../../helpers/firebase'





// Local constants
const articleDefaults = {
  body: '',
  id: null,
  publishedAt: null,
  title: '',
}
const database = firebaseApp.database()
const defaultOptions = {
  limit: false,
  page: 1,
  includeDrafts: false,
}





export const getArticle = (id, includeDrafts = false) => async dispatch => {
  let snapshot = await database.ref(`/articles/${id}`).once('value')
  let result = snapshot.val()

  if (!result && includeDrafts) {
    snapshot = await database.ref(`/drafts/${id}`).once('value')
    result = snapshot.val()
  }

  dispatch({
    payload: {
      ...snapshot.val(),
      id,
    },
    status: 'success',
    type: actionTypes.GET_ARTICLE,
  })
}





export const getArticles = (options = {}) => async dispatch => {
  const {
    limit,
    page,
    includeDrafts,
  } = { ...defaultOptions, ...options }
  const results = {}

  const processQuery = async (collection, index) => {
    let query = database.ref(`/${collection}`)

    query = query.orderByChild(index)

    if (page && (page > 1)) {
      query = query.endAt((page - 1) * limit)
    }

    if (limit) {
      query = query.limitToLast(limit)
    }

    const snapshot = await query.once('value')

    return snapshot.val()
  }

  let articles = await processQuery('articles', 'publishedAt')

  if (includeDrafts) {
    const drafts = await processQuery('drafts', 'createdAt')

    articles = {
      ...articles,
      ...drafts,
    }
  }

  Object.entries(articles || {}).forEach(([key, value]) => {
    results[key] = {
      ...articleDefaults,
      ...value,
    }
  })

  dispatch({
    payload: results,
    status: 'success',
    type: actionTypes.GET_ARTICLES,
  })
}





export const saveArticle = (article, publish = false) => async dispatch => {
  const now = moment.utc().valueOf()
  const serializedArticle = { ...article }
  let collection = 'drafts'
  let {
    id,
    publishedAt,
  } = article

  serializedArticle.updatedAt = now

  if (publish) {
    serializedArticle.publishedAt = now
  }

  if (publish || (!publish && publishedAt)) {
    collection = 'articles'
  }

  if (id) {
    await database.ref(`/${collection}/${id}`).update(serializedArticle)

    if (publish) {
      await database.ref(`/drafts/${id}`).remove()
    }
  } else {
    serializedArticle.createdAt = now
    id = uuid()
    serializedArticle.id = id
    await database.ref(`/${collection}/${id}`).set(serializedArticle)
  }

  dispatch({
    payload: serializedArticle,
    status: 'success',
    type: actionTypes.SAVE_ARTICLE,
  })

  return serializedArticle
}
