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