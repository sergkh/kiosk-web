import express, { type NextFunction, type Request, type Response } from "express";
import ViteExpress from "vite-express";
import login from "./login.ts";
import cookieParser from 'cookie-parser';
import { updateNews } from "./parsers/news.ts";
import infoApi from "./info-api.ts";
import { initDb, infoCards } from "./db";
import { loadAllFaculties } from "./parsers/faculties.ts";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("data/public/uploads"));
app.use("/api", login);
app.use("/api/info", infoApi);

app.get("/admin", (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/admin") { res.redirect(301, "/admin/"); } else next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error in request:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query
  });

  res.status(500).send({ error: err.message });
})

async function startServer() {
  try {
    await initDb();

    loadAllFaculties(); // Initialize faculties data
    
    // Update news every 1 hour
    setInterval(updateNews, 1000 * 60 * 60 * 6); // TODO: put into config
    
    await updateNews();

    ViteExpress.listen(app, 3000, () =>
      console.log("Server is listening on http://localhost:3000/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1); 
  }
}


startServer();
