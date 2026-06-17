import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

const uploadDir = path.resolve(process.cwd(), "uploads", "students");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  }
});

export const studentPhotoUpload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      callback(new HttpError(400, "Student photo must be a JPG, PNG, or WEBP image."));
      return;
    }

    callback(null, true);
  }
});
