import express, { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import ViteExpress from "vite-express";
import login from "./login.ts";
import cookieParser from 'cookie-parser';
import { updateNews } from "./parsers/news.ts";
import infoApi from "./info-api.ts";
import { initDb } from "./db";
import { loadAllFaculties } from "./parsers/faculties.ts";
import { loadAllCenters, ensureInitialCenters } from "./parsers/centers.ts";
import { syncRectoratData } from "./parsers/rectorat";
import path from "path";
import videoRoutes from './video-api';
import subtitlesRouter from "./subtitles-api.ts"

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

const uploadsPath = process.env.UPLOADS_DIR || path.join(process.cwd(), 'data/uploads');
app.use('/uploads/videos/:filename', (req, res, next) => {
  const ext = path.extname(req.params.filename).toLowerCase();
  if (ext === '.mp4') {
    res.type('video/mp4');
  } else if (ext === '.webm') {
    res.type('video/webm');
  } else if (ext === '.ogg') {
    res.type('video/ogg');
  }
  next();
});

app.use("/uploads", express.static("data/public/uploads"));
app.use("/api", login);
app.use("/api/info", infoApi);

app.get("/admin", (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/admin") { res.redirect(301, "/admin/"); } else next();
});

app.use('/api/admin', videoRoutes);

app.use(subtitlesRouter);

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
    await ensureInitialCenters();
    await loadAllCenters();
    
    // Update news every 1 hour
    setInterval(updateNews, 1000 * 60 * 60 * 6); // TODO: put into config
    
    await updateNews();
    await syncRectoratData();

    ViteExpress.listen(app, 3000, () =>
      console.log("Server is listening on http://localhost:3000/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1); 
  }
}


startServer();
