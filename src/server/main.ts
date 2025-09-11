import express from "express";
import ViteExpress from "vite-express";
import type { Article, StudentInfo } from "../shared/models";
import { newsData, studentInfo } from "./data";

const app = express();

app.get("/student-info", (_, res) => {
  res.json(studentInfo);
});

app.get("/news", (_, res) => {
  res.json(newsData);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
