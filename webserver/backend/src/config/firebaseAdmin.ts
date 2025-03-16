// src/config/firebaseAdmin.ts
import admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json'; // adjust the path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export default admin;
