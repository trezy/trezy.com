// Local imports
import { firebaseApp } from '../../helpers/firebase'
import ConnectionManager from '../../helpers/connectionManager'





// Local constants
const connectionManager = new ConnectionManager
const database = firebaseApp.firestore()
const actionTypeCreator = (action, entityType) => `${action}_${entityType}`.toUpperCase()





export const connectCollection = (collectionName, options = {}) => dispatch => {
  if (!connectionManager.find(collectionName)) {
    let collection = database.collection(collectionName)

    if (options.where) {
      options.where.forEach(query => {
        collection = collection.where(...query)
      })
    }

    if (options.orderBy) {
      collection = collection.orderBy(...options.orderBy)
    }

    if (options.limit) {
      collection = collection.limit(options.limit)
    }

    const unsubscribe = collection.onSnapshot(snapshot => {
      const data = {}
      snapshot.forEach(doc => {
        data[doc.id] = {
          ...doc.data(),
          id: doc.id,
        }
      })

      dispatch({
        payload: data,
        status: 'success',
        type: actionTypeCreator('get', collectionName),
      })
    })

    connectionManager.add({
      collection,
      unsubscribe,
      name: collectionName,
    })
  }
}





export const disconnectCollection = collectionName => () => {
  connectionManager.remove(collectionName)
}
