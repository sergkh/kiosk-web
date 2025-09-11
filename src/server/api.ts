import express from "express";
import admin, { type ServiceAccount } from "firebase-admin";

import config from "./config";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

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

    console.log(`User ${decoded.email} authenticated successfully`);

    res.json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default api;