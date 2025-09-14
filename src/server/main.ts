import express, { type Request, type Response } from "express";
import ViteExpress from "vite-express";
import { getNewsData, studentInfo } from "./data";
import api from "./api";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", api);

app.get("/student-info", (_, res) => {
  res.json(studentInfo);
});

app.get("/news", async (req: Request, res: Response) => {
  try {
    const articles = await getNewsData(); 
    res.json(articles);
  } catch (error) {
    console.error("Помилка при відправленні новин:", error);
    res.status(500).json({ error: "Не вдалося отримати новини" });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on http://localhost:3000/"),
);
