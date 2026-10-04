import multer from 'multer';
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
export const uploadMulterMiddleware = (limits?: TLimit) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 1024 * 1024, ...limits},
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
      }

      cb(null, true);
    }
  });
};
