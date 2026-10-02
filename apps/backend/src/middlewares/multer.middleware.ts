import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

export const LIMITS = {
  fileSize: 1024 * 1024 // 1MB
};

export const uploadMulterMiddleware = (destination: string) => {
  const uploadPath = path.join('uploads', destination);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(uploadPath, {recursive: true});
      cb(null, uploadPath);
    },

    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);
      const dateNow = new Date().toISOString().replace(/:/g, '').replace(/-/g, '');
      const fileNameWithoutExtension = file.originalname.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${fileNameWithoutExtension}-${dateNow}${extension}`);
    }
  });

  return multer({
    storage,
    limits: LIMITS,
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
      }

      cb(null, true);
    }
  });
};
