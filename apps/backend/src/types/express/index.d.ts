import type {UserPayload} from '../../lib/jwt.ts';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export {};
