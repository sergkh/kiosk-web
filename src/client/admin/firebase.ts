import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}