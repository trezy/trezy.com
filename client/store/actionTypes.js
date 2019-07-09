const actionTypes = [
  'GET_ARTICLE',
  'GET_ARTICLES',
].reduce((acc, actionType) => ({
  ...acc,
  [actionType]: actionType,
}), {})





export default actionTypes
