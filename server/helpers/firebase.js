// Local constants
const firebaseCertData = {}
const firebaseCertKeys = [
  'auth_provider_x509_cert_url',
  'auth_uri',
  'client_email',
  'client_id',
  'client_x509_cert_url',
  'database_url',
  'project_id',
  'private_key_id',
  'private_key',
  'token_uri',
  'type',
]

// Local variables
let firebaseApp = null





firebaseCertKeys.forEach(key => firebaseCertData[key] = process.env[`FIREBASE_${key.toUpperCase()}`].replace(/\\n/g, '\n'))





const getFirebaseApp = () => {
  if (!firebaseApp) {
    /* eslint-disable-next-line global-require */
    const admin = require('firebase-admin')

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseCertData),
      databaseURL: firebaseCertData.database_url,
    })
  }

  return firebaseApp
}





module.exports = getFirebaseApp
