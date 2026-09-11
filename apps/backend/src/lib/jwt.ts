import jwt, {SignOptions, JwtPayload} from 'jsonwebtoken';
import {env} from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET;

export interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export function generateToken(user: UserPayload): string {
  const options: SignOptions = {
    expiresIn: '1h'
  };

  return jwt.sign(user, JWT_SECRET, options);
}

export function verifyToken(token: string): UserPayload | undefined {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
    return decoded as UserPayload;
  }

  return undefined;
}
