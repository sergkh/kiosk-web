import admin from "firebase-admin";
import { type NextFunction, type Request, type Response } from "express";

// Tell Typescript that REquest has a user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      email?: string;
      picture?: string;
    };
  }
}

export async function authorized(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionCookie = req.cookies.session || "";
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.VITE_FIREBASE_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

if (!firebaseConfig.apiKey) {
  console.warn("Firebase client configuration is missing. Please set the environment variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_SENDER_ID, and VITE_FIREBASE_APP_ID.");
}