// Local imports
import { firebaseApp } from '../../helpers/firebase'
import ConnectionManager from '../../helpers/connectionManager'





// Local constants
const connectionManager = new ConnectionManager
const database = firebaseApp.firestore()
const actionTypeCreator = (action, entityType) => `${action}_${entityType}`.toUpperCase()





export const connectCollection = collectionName => dispatch => {
  if (!connectionManager.find(collectionName)) {
    const collection = database.collection(collectionName)

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
