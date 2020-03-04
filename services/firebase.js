const firebaseAdmin = require('firebase-admin');
//you must generate your own serviceAccountKey following
//this doc: https://firebase.google.com/docs/admin/setup#initialize_the_sdk
const serviceAccount = require('../serviceAccountKey.json');

firebaseAdmin.apps.length
    ? ''
    : firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });

module.exports = {
    database: firebaseAdmin.database()
};
