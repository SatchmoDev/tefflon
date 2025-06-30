import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyAyHhVzAyGceFBQAWLjsvXzWvdiF8VnU64",
  authDomain: "tefflod.firebaseapp.com",
  projectId: "tefflod",
  storageBucket: "tefflod.firebasestorage.app",
  messagingSenderId: "484196876691",
  appId: "1:484196876691:web:bc34fb01e95a416dd46866",
})

export const db = getFirestore(app)
export const auth = getAuth(app)
