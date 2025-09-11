import express from "express";
import ViteExpress from "vite-express";
import { newsData, studentInfo } from "./data";

import { config } from "./config";

const app = express();

app.get("/student-info", (_, res) => {
  res.json(studentInfo);
});

app.get("/news", (_, res) => {
  res.json(newsData);
});

app.get("/admin/firebase-config.json", (_, res) => {
  res.json(config.firebaseConfig);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
