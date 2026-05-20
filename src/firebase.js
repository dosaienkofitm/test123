// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ-RVq7AKNci7MYFUrLug9YXk2IiyWNKw",
  authDomain: "learnproject-43ded.firebaseapp.com",
  projectId: "learnproject-43ded",
  storageBucket: "learnproject-43ded.firebasestorage.app",
  messagingSenderId: "561416389196",
  appId: "1:561416389196:web:8374cc0e9811faf2dbeae9",
  measurementId: "G-EK71YF2XWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);