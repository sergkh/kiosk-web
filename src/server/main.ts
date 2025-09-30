import express, { type Request, type Response } from "express";
import ViteExpress from "vite-express";
import api from "./api";
import cookieParser from 'cookie-parser';
import { parseAllNews } from "./parser";
import stud_cards from "./student_api.ts";
import abit_cards from "./abiturient_api.ts";
import { initDb } from "./db"; 

async function startServer() {
  try {
    const db = await initDb(); 
    
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use("/api", api);
    app.use(stud_cards);
    app.use(abit_cards);

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
      console.log("Server is listening on http://localhost:3000/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1); 
  }
}


startServer();
