// Component imports
import actionTypes from '../actionTypes'





export const getArticles = () => () => ({
  payload: {},
  status: 'success',
  type: actionTypes.GET_ARTICLES,
})

export const getArticle = () => () => ({
  payload: {},
  status: 'success',
  type: actionTypes.GET_ARTICLE,
})
