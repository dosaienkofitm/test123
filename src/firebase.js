import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAZ-RVq7AKNci7MYFUrLug9YXk2IiyWNKw',
  authDomain: 'learnproject-43ded.firebaseapp.com',
  projectId: 'learnproject-43ded',
  storageBucket: 'learnproject-43ded.firebasestorage.app',
  messagingSenderId: '561416389196',
  appId: '1:561416389196:web:8374cc0e9811faf2dbeae9',
  measurementId: 'G-EK71YF2XWV',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)