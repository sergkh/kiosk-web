import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import { type Request } from "express";
import crypto from "crypto";

const uploadDir = "./data/public/uploads";
const videoUploadDir = path.join(uploadDir, 'videos');
export const videoPreviewsDir = path.join(uploadDir, 'videos', 'previews');

if (!fs.existsSync(videoPreviewsDir)) fs.mkdirSync(videoPreviewsDir, { recursive: true });

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_UPLOAD_SUBFOLDERS = new Set(['centers', 'rectorat', 'subtitles']);

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const category = (req.params as any)?.category || (req.body as any)?.category;
    const subfolder = category && ALLOWED_UPLOAD_SUBFOLDERS.has(category) ? category : null;
    const targetDir = subfolder ? path.join(uploadDir, subfolder) : uploadDir;
    if (subfolder && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const name = crypto.randomBytes(64).toString("hex");
    cb(null, name + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image/png")) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG image files are allowed!"));
    }
  },
});

export const singleImageUpload = upload.single("image");

export const imageUrl = (fileName?: string | null, subfolder: string | null = null): string | null => 
  fileName ? subfolder ? `/uploads/${subfolder}/${fileName}` : `/uploads/${fileName}` : null;

export const videoUrl = (fileName?: string | null): string | null => 
  fileName ? `/uploads/videos/${fileName}` : null;

export const videoPreviewUrl = (fileName?: string | null): string | null => 
  fileName ? `/uploads/videos/previews/${fileName}` : null;

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const videoUpload = multer({ 
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg|jpg|jpeg|png|vtt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/vtt' || file.mimetype === 'application/x-subrip';
    
    if (mimetype && extname) {
      return cb(null, true);
    }    
    cb(new Error('Тільки відео, зображення або субтитри дозволені!'));
  }
});

// Download external asset into uploads directory
// returns the relative URL to the saved image
export async function downloadedAsset(assetUrl: string, subfolder: string | null = null): Promise<string | null> {
  try {
    const response = await fetch(assetUrl);
    if (!response.ok) {
      console.warn(`Failed to download image from ${assetUrl}: ${response.statusText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash("sha1").update(Buffer.from(buffer)).digest("hex");
    const ext = path.extname(new URL(assetUrl).pathname);
    const filename = `${hash}${ext}`;
    const basePath = subfolder ? path.join(uploadDir, subfolder) : uploadDir;
    if (subfolder && !fs.existsSync(basePath)) fs.mkdirSync(basePath);
    const filePath = path.join(basePath, filename);

    await fsAsync.writeFile(filePath, Buffer.from(buffer));
    console.log(`Asset ${assetUrl} downloaded and saved as ${filename}`);
    return imageUrl(filename, subfolder);    
  } catch (error) {
    console.error(`Error downloading or saving asset ${assetUrl}:`, error);
    return null;
  }
}