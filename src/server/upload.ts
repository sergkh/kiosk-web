import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { type Request } from "express";
import crypto from "crypto";

const uploadDir = "./data/public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "data/public/uploads");
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
export const imageUrl = (fileName?: string | null): string | null => fileName ? `/uploads/${fileName}` : null;