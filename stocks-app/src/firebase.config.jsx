// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged  } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk-Dh0YHSbvK5Fa1S5vKuqw530ZlXKSqY",
  authDomain: "stocks-9bc4d.firebaseapp.com",
  databaseURL: "https://stocks-9bc4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stocks-9bc4d",
  storageBucket: "stocks-9bc4d.appspot.com",
  messagingSenderId: "69823950496",
  appId: "1:69823950496:web:9e2810b87c3bc3c4c2e3c5",
  measurementId: "G-G6W0HZMQBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
// Create a storage reference from our storage service


export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged, storage   };
// const analytics = getAnalytics(app);
export const db = getFirestore(app);