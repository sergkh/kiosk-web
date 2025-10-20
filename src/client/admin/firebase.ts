import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null;

export async function signInWithGoogle() {
  if (!app) {
    const firebaseConfig = await fetch('/api/auth/firebase-config.json').then(res => res.json());
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }

  return signInWithPopup(auth!, googleProvider!);
}