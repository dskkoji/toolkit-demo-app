import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  apiKey: "AIzaSyAinF3ftckefEh5qFiBVxRamFdbinLfap0",
  authDomain: "ec-app-demo-370cd.firebaseapp.com",
  projectId: "ec-app-demo-370cd",
  storageBucket: "ec-app-demo-370cd.appspot.com",
  messagingSenderId: "2151119238",
  appId: "1:2151119238:web:f96bf08b393ccacbeb9407",
  measurementId: "G-VRJFRZL13Y"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth()
export const storage = getStorage()