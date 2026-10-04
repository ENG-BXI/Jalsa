import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

interface TLimit {
  fieldNameSize?: number | undefined;
  fieldSize?: number | undefined;
  fields?: number | undefined;
  fieldNestingDepth?: number | undefined;
  fieldArrayIndexLimit?: number | undefined;
  fileSize?: number | undefined;
  files?: number | undefined;
  parts?: number | undefined;
  headerPairs?: number | undefined;
}
export const uploadMulterMiddleware = (destination: string, limits?: TLimit) => {
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
    limits: {fileSize: 1024 * 1024, ...limits},
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
      }

      cb(null, true);
    }
  });
};
