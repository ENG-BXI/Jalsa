import {NextFunction, Request, Response} from 'express';
import multer from 'multer';

export function ErrorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          message: 'The uploaded image is too large.'
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          message: 'Unexpected file field. Expected "serverImage".'
        });

      default:
        return res.status(400).json({
          message: 'Failed to upload file.',
          error: error.message
        });
    }
  }

  if (error instanceof Error) {
    return res.status(400).json({
      message: error.message
    });
  }

  return res.status(500).json({
    message: 'Internal server error.'
  });
}
