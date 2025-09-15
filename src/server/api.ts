import express from "express";
import admin, { type ServiceAccount } from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import config from "./config";
import { authorized } from "./auth";

const dir = dirname(fileURLToPath(import.meta.url))
const accountFile = ['/app/data/serviceAccount.json', resolve(dir, './serviceAccount.json')].find(fs.existsSync)

console.log(`Using service account from ${accountFile}`)

if (!accountFile) {
  console.warn("Service account file not found. Please provide a valid service account JSON file for Admin page to work.");
} else {
  const serviceAccount = JSON.parse(fs.readFileSync(accountFile, 'utf8')) as ServiceAccount

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

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