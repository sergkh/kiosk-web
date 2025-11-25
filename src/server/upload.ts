import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import { type Request } from "express";
import crypto from "crypto";

const uploadDir = "./data/public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadDir);
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