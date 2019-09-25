const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

const firestore = admin.firestore()

exports.onUserStatusChanged = functions.database.ref('game/characters/{id}/status').onUpdate(async (change, context) => {
  const eventStatus = change.after.val()
  const userStatusFirestoreRef = firestore.doc(`characters/${context.params.id}`)
  const statusSnapshot = await change.after.ref.once('value')
  const status = statusSnapshot.val()

  if (status.updatedAt > eventStatus.updatedAt) {
    return null
  }

  eventStatus.updatedAt = new Date(eventStatus.updatedAt)

  return userStatusFirestoreRef.update({ active: eventStatus.active })
})
