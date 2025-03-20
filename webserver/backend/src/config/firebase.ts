import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export function initializeFirebaseAdmin() {
  try {
    // Check if app is already initialized
    if (admin.apps.length === 0) {
      console.log("Project ID:", process.env.REACT_APP_FIREBASE_PROJECT_ID);
      
      // Use the environment variables you've provided
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        }),
        databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
      
      console.log('Firebase Admin SDK initialized successfully');
    }
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
}