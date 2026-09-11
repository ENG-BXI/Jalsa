import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../lib/http-status.js';
import {verifyToken} from '../lib/jwt.js';

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized'
    });
  }

  try {
    const user = verifyToken(token);
    //   Pass User Object into Request
    req.user = user;
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized'
    });
  }
  next();
}
