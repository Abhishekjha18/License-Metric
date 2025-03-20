// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH0a27AzGUtqBd3EXP9mbRI-aRvVxtpD0",
  authDomain: "license-metrics.firebaseapp.com",
  projectId: "license-metrics",
  storageBucket: "license-metrics.firebasestorage.app",
  messagingSenderId: "470422614547",
  appId: "1:470422614547:web:522e568917887a0df2c5e6",
  measurementId: "G-VVQDPNL2CT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
