import path from 'path';
import multer from 'multer';
import { UPLOADS_DIR } from './db';

// Multer storage engine for handling incoming multipart uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

// File filter to restrict uploads to safe images
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are allowed.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB limit
  }
});

/**
 * Persists an uploaded file in the dedicated tournament storage engine
 * and returns the permanent self-hosted URL `/api/uploads/:filename`.
 */
export async function persistFile(file: Express.Multer.File): Promise<string> {
  const fileName = file.filename;
  return `/api/uploads/${fileName}`;
}
