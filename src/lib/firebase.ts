import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyAXpkhih0a1bS7l-tNpZAG_eYYrQuaWZtg",
  authDomain: "tefflog.firebaseapp.com",
  projectId: "tefflog",
  storageBucket: "tefflog.firebasestorage.app",
  messagingSenderId: "64488639420",
  appId: "1:64488639420:web:981c4f7659b867d90fb9b9",
  measurementId: "G-XM29BB64PX",
})

export const db = getFirestore(app)
export const auth = getAuth(app)
