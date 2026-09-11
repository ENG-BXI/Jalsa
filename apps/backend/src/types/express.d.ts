import type {UserPayload} from '../lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export {};
