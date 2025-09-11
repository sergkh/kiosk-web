import express from "express";
import admin, { type ServiceAccount } from "firebase-admin";

import config from "./config";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };
import { authorized } from "./auth";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const api = express.Router();

api.post("/auth", async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    
    if (!config.admins.includes(decoded.email!)) {
      console.error(`Unauthorized access attempt by ${decoded.email}`);
      return res.status(403).json({ error: "Access denied" });
    }

    console.log(`User ${decoded.email} authenticated. Creating ${config.secureCookie ? 'secure' : 'dev' } session cookie`);

    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn: config.sessionExpiration });

    res.cookie("session", 
      sessionCookie, 
      { httpOnly: true, secure: config.secureCookie, maxAge: config.sessionExpiration }
    ).json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

api.get("/user", authorized, async (req, res) => {
  console.log(`Fetching user profile for ${req.user?.email}`);
  res.json(req.user);
});

api.get("/auth/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ message: "Logged out successfully" });
});


export default api;