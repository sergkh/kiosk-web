import express from "express";
import ViteExpress from "vite-express";
import { newsData, studentInfo } from "./data";
import api from "./api";

const app = express();

app.use(express.json());
app.use("/api", api);

app.get("/student-info", (_, res) => {
  res.json(studentInfo);
});

app.get("/news", (_, res) => {
  res.json(newsData);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
