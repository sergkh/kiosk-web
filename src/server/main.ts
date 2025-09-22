import express, { type Request, type Response } from "express";
import ViteExpress from "vite-express";
import api from "./api";
import cookieParser from 'cookie-parser';
import { parseAllNews } from "./parser";
import cards from "./student_api.ts";



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", api);
app.use(cards);


app.get("/news", async (req: Request, res: Response) => {
  try {
    const articles = await parseAllNews(); 
    res.json(articles);
  } catch (error) {
    console.error("Помилка при відправленні новин:", error);
    res.status(500).json({ error: "Не вдалося отримати новини" });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on http://localhost:3000/"),
);
