import { getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const app = getApps()[0] || initializeApp()
export const auth = getAuth(app)
