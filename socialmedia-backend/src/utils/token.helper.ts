import { logger } from '@config/logger';
import { IUser } from '@models/user.model';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret';

export enum ExpiryOptions {
  access = "1d",
  refresh = "1d"
}

export function TokenGenerator(payload: object, expiry: ExpiryOptions): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiry });
}

export function TokenVerification(token: string): IUser | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as IUser;
    return decoded;
  } catch (error) {
    logger.error('JWT Verification Error:', error);
    return null;
  }
}

