import express, { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import ViteExpress from "vite-express";
import login from "./login.ts";
import cookieParser from 'cookie-parser';
import { updateNews } from "./parsers/news.ts";
import infoApi from "./info-api.ts";
import { initDb } from "./db";
import { loadAllFaculties } from "./parsers/faculties.ts";
import { loadAllCenters} from "./parsers/centers.ts";
import { syncRectoratData } from "./parsers/rectorat";
import videoRoutes from './video-api';

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("data/public/uploads", {
  setHeaders: (res, path) => {
    if (path.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    } else if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (path.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (path.endsWith('.ogg')) {
      res.setHeader('Content-Type', 'video/ogg');
    }
  }
}));
app.use("/api", login);
app.use("/api/info", infoApi);
app.use('/api', videoRoutes);

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
    loadAllCenters();
    
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
