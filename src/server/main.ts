import express, { type NextFunction, type Request, type Response } from "express";
import ViteExpress from "vite-express";
import login from "./login.ts";
import cookieParser from 'cookie-parser';
import { parseAllNews } from "./news-parser";
import studApi from "./student_api.ts";
import abitApi from "./abiturient_api.ts";
import { initDb } from "./db";
import facultiesApi from "./faculties_api"; 



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("data/public/uploads"));
app.use("/api", login);
app.use(studApi);
app.use(abitApi);
app.use("/api/faculties", facultiesApi);

app.get("/news", async (req: Request, res: Response) => {
  res.json(await parseAllNews());
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ error: err.message });
})

async function startServer() {
  try {
    await initDb(); 

    ViteExpress.listen(app, 3000, () =>
      console.log("Server is listening on http://localhost:3000/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1); 
  }
}


startServer();
